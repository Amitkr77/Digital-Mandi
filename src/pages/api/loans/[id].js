// pages/api/loans/[id].js - Handles GET (single), PATCH (update), POST /repay
import { getSession } from 'next-auth/react';
import Loan from '@/models/Loan';
import dbConnect from '@/utils/mongoDb';
import Farmer from '@/models/Farmer';

export default async function handler(req, res) {
    const { id } = req.query;
    const session = await getSession({ req });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    if (req.method === 'GET') {
        // View single loan
        try {
            const loan = await Loan.findOne({ _id: id, farmerId: session.user.id })
                .populate('linkedTransaction', 'produce amount buyerId');

            if (!loan) return res.status(404).json({ error: 'Loan not found' });

            res.status(200).json(loan);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch loan' });
        }
    } else if (req.method === 'PATCH') {
        // Update status (farmer-limited)
        try {
            const { status, remarks } = req.body;
            const loan = await Loan.findOne({ _id: id, farmerId: session.user.id });

            if (!loan) return res.status(404).json({ error: 'Loan not found' });

            if (['Repaid Partially', 'Closed'].includes(status)) {
                loan.status = status;
                if (remarks) loan.remarks = remarks;
                await loan.save();

                // Boost creditScore on close
                if (status === 'Closed') {
                    const farmer = await Farmer.findById(session.user.id);
                    farmer.creditScore = Math.min(900, farmer.creditScore + 10);
                    await farmer.save();
                }

                res.status(200).json({ message: 'Loan updated', loan });
            } else {
                res.status(403).json({ error: 'Unauthorized update' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update loan' });
        }
    } else if (req.method === 'POST' && req.body.action === 'repay') {
        // Record repayment (treat as POST /repay)
        try {
            const { amount, method, remarks } = req.body;
            if (!amount || amount <= 0 || !['Cash', 'Bank Transfer', 'UPI', 'NEFT', 'Cheque'].includes(method)) {
                return res.status(400).json({ error: 'Invalid payment details' });
            }

            const loan = await Loan.findOne({ _id: id, farmerId: session.user.id });
            if (!loan || loan.status === 'Closed') return res.status(400).json({ error: 'Invalid loan for repayment' });

            // Add to history
            loan.repayment.history.push({
                amount,
                method,
                remarks,
                date: new Date()
            });
            loan.repayment.totalPaid += amount;

            // Update nextDueDate (simple: advance if full EMI paid)
            if (amount >= loan.emiAmount) {
                const nextMonth = new Date(loan.repayment.nextDueDate || loan.dueDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                loan.repayment.nextDueDate = nextMonth;
            }

            // Auto-close if fully paid
            const totalDue = loan.amount * (1 + (loan.interestRate / 100) * (loan.duration / 12));
            if (loan.repayment.totalPaid >= totalDue) {
                loan.status = 'Closed';
            }

            await loan.save();

            res.status(200).json({
                message: 'Payment recorded',
                updated: {
                    totalPaid: loan.repayment.totalPaid,
                    remaining: totalDue - loan.repayment.totalPaid,
                    status: loan.status
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to record payment' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PATCH', 'POST']);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

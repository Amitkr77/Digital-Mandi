// pages/api/loans/repay.js
import dbConnect from '@/utils/mongoDb';
import Loan from '@/models/Loan';
import Repayment from '@/models/Repayment';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();

  const { loanId, amountPaid, paymentMode = 'Cash' } = req.body;

  try {
    const pending = await Repayment.findOne({ loanId, status: 'Pending' }).sort({ dueDate: 1 });
    if (!pending) return res.status(400).json({ success: false, error: 'No pending installment' });

    pending.amountPaid = amountPaid;
    pending.paidOn = new Date();
    pending.paymentMode = paymentMode;
    pending.status = 'Paid';
    await pending.save();

    // Update loan status
    const totalPaid = await Repayment.aggregate([
      { $match: { loanId, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);

    const loan = await Loan.findById(loanId);
    const remaining = loan.approvedAmount + (loan.approvedAmount * loan.interestRate * loan.tenureMonths / 1200) - totalPaid[0]?.total;

    if (remaining <= 0) {
      loan.status = 'Completed';
      await loan.save();
    }

    res.status(200).json({
      success: true,
      data: { remainingBalance: Math.max(0, remaining), status: loan.status },
      message: 'Payment recorded',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
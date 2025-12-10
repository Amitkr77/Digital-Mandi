// pages/api/loans/repayments/[loanId].js
import dbConnect from '@/utils/mongoDb';
import Repayment from '@/models/Repayment';
import Loan from '@/models/Loan';

export default async function handler(req, res) {
  const { loanId } = req.query;
  await dbConnect();

  try {
    const schedule = await Repayment.find({ loanId }).sort({ dueDate: 1 });
    const loan = await Loan.findById(loanId);

    const totalPaid = schedule.reduce((sum, r) => sum + r.amountPaid, 0);

    res.status(200).json({
      success: true,
      data: {
        loanId,
        totalAmount: loan.approvedAmount,
        totalPaid,
        remaining: loan.approvedAmount - totalPaid + (loan.approvedAmount * loan.interestRate * loan.tenureMonths / 1200),
        schedule: schedule.map(s => ({
          installmentNo: s.installmentNo,
          dueDate: s.dueDate,
          amountDue: s.amountDue,
          amountPaid: s.amountPaid,
          status: s.status,
          paidOn: s.paidOn,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
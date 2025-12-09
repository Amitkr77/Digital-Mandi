// pages/api/loans/approve.js
import dbConnect from '@/lib/dbConnect';
import Loan from '@/models/Loan';
import Repayment from '@/models/Repayment';
import { getCurrentUser } from '@/lib/auth';
import { sendNotification } from '@/services/notification';

function generateRepaymentSchedule(loan) {
  const monthlyInterest = loan.interestRate / 12 / 100;
  const emi = (loan.approvedAmount * monthlyInterest * Math.pow(1 + monthlyInterest, loan.tenureMonths)) /
              (Math.pow(1 + monthlyInterest, loan.tenureMonths) - 1);

  const schedule = [];
  let balance = loan.approvedAmount;
  let dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + 1);

  for (let i = 1; i <= loan.tenureMonths; i++) {
    const interest = balance * monthlyInterest;
    const principal = emi - interest;
    balance -= principal;

    schedule.push({
      loanId: loan._id,
      installmentNo: i,
      dueDate: new Date(dueDate),
      amountDue: Math.round(emi),
      amountPaid: 0,
      status: 'Pending',
    });

    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  return schedule;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();

  const user = await getCurrentUser(req);
  if (!user || user.role !== 'admin') return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { loanId, approvedAmount, interestRate, tenureMonths } = req.body;

  try {
    const loan = await Loan.findByIdAndUpdate(
      loanId,
      {
        approvedAmount,
        interestRate,
        tenureMonths,
        status: 'Approved',
        approvedAt: new Date(),
      },
      { new: true }
    ).populate('farmerId');

    // Generate schedule
    const schedule = generateRepaymentSchedule(loan);
    await Repayment.insertMany(schedule);

    await sendNotification(loan.farmerId.phone, `🎉 Your loan of ₹${approvedAmount} has been APPROVED!`);

    res.status(200).json({ success: true, message: 'Loan approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
// pages/api/cron/daily-reminders.js
import dbConnect from '@/utils/mongoDb';
import Repayment from '@/models/Repayment';
import Loan from '@/models/Loan';
import Farmer from '@/models/Farmer';
import { sendNotification } from '@/services/notification';

export default async function handler(req, res) {
  await dbConnect();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Find due tomorrow
  const dueSoon = await Repayment.find({
    dueDate: { $gte: today, $lt: tomorrow },
    status: 'Pending',
  }).populate({
    path: 'loanId',
    populate: { path: 'farmerId', select: 'name phone' },
  });

  for (const repayment of dueSoon) {
    const farmer = repayment.loanId.farmerId;
    await sendNotification(
      farmer.phone,
      `Reminder: ₹${repayment.amountDue} due tomorrow (Installment ${repayment.installmentNo})`
    );
  }

  res.status(200).json({ success: true, reminded: dueSoon.length });
}
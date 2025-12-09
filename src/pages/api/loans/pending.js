// pages/api/loans/pending.js
import dbConnect from '@/lib/dbConnect';
import Loan from '@/models/Loan';
import Farmer from '@/models/Farmer';
import { getCurrentUser } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await dbConnect();
  const user = await getCurrentUser(req);
  if (!user || user.role !== 'admin') return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    const pendingLoans = await Loan.find({ status: 'Pending Approval' })
      .populate('farmerId', 'name phone aadhaar village')
      .sort({ requestedAt: -1 });

    const formatted = pendingLoans.map(loan => ({
      loanId: loan._id,
      farmerName: loan.farmerId.name,
      farmerPhone: loan.farmerId.phone,
      amountRequested: loan.amountRequested,
      loanPurpose: loan.loanPurpose,
      requestedAt: loan.requestedAt,
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
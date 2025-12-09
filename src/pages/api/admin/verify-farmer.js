// pages/api/admin/verify-farmer.js
import dbConnect from '@/utils/mongoDb';
import Farmer from '@/models/Farmer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();

  const { farmerId } = req.body;

  if (!farmerId) return res.status(400).json({ error: 'farmerId required' });

  const farmer = await Farmer.findOneAndUpdate(
    { farmerId },
    { 
      verificationStatus: 'verified',
      status: 'active',
      creditScore: 750
    },
    { new: true }
  );

  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

  return res.status(200).json({
    success: true,
    message: 'Farmer verified successfully!',
    farmer: {
      farmerId: farmer.farmerId,
      name: farmer.name,
      phone: farmer.phone[0],
      verificationStatus: farmer.verificationStatus
    }
  });
}
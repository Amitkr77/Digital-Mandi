// pages/api/loans/request.js
import dbConnect from '@/utils/mongoDb';
import Loan from '@/models/Loan';
import Farmer from '@/models/Farmer';
import { sendNotification } from '@/services/notification';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  await dbConnect();

  const {
    farmerId,           // ← This is your custom string like "FRM1732781234AB12"
    type = 'Loan',
    amount,
    duration,
    purpose: rawPurpose,     // we'll map it to enum
    collateral,
    guarantor,
    preferredRepaymentMonths,
    linkedTransaction,
    remarks
  } = req.body;

  // === Basic Validation ===
  if (!farmerId) return res.status(400).json({ success: false, error: 'farmerId is required' });
  if (!amount || amount < 1000) return res.status(400).json({ success: false, error: 'Amount ≥ ₹1000' });
  if (!duration || duration < 1 || duration > 36) return res.status(400).json({ success: false, error: 'Duration 1–36 months' });

  // Map free-text purpose → valid enum (you can improve this mapping later)
  const purposeMap = {
    "बीज": "Seeds/Fertilizer",
    "खाद": "Seeds/Fertilizer",
    "बुवाई": "Seeds/Fertilizer",
    "कटाई": "Crop Maintenance",
    "उपकरण": "Equipment",
    "इमरजेंसी": "Emergency",
    "एडवांस": "Harvest Advance",
    "अन्य": "Other"
  };

  let purpose = "Other";
  if (rawPurpose) {
    const lower = rawPurpose.toLowerCase();
    if (lower.includes("बीज") || lower.includes("खाद") || lower.includes("fertilizer") || lower.includes("seed")) purpose = "Seeds/Fertilizer";
    else if (lower.includes("उपकरण") || lower.includes("equipment")) purpose = "Equipment";
    else if (lower.includes("इमरजेंसी") || lower.includes("emergency")) purpose = "Emergency";
    else if (lower.includes("एडवांस") || lower.includes("harvest") || lower.includes("advance")) purpose = "Harvest Advance";
    else if (lower.includes("मेंटेनेंस") || lower.includes("maintenance") || lower.includes("कटाई")) purpose = "Crop Maintenance";
  }

  try {
    // 1. Find farmer by custom farmerId (string)
    const farmer = await Farmer.findOne({ farmerId })
      .select('_id name phone creditScore verificationStatus landSize')
      .lean();

    if (!farmer) return res.status(404).json({ success: false, error: 'Farmer not found' });
    if (farmer.verificationStatus !== 'verified') {
      return res.status(403).json({ success: false, error: 'Farmer profile is not verified yet. Please complete KYC.' });
    }

    // Prevent multiple active loans
    const activeCount = await Loan.countDocuments({
      farmerId: farmer._id,  // ← now using real ObjectId
      status: { $in: ['Pending', 'Approved', 'Disbursed'] }
    });
    if (activeCount > 0) {
      return res.status(400).json({ success: false, error: 'You already have a pending/active loan' });
    }

    // 2. Create loan — now matches schema exactly
    const loan = await Loan.create({
      farmerId: farmer._id,           // ← Critical: real MongoDB _id (ObjectId)
      farmerName: farmer.name,
      type,
      amount: Number(amount),
      interestRate: type === 'Advance' ? 0 : 12,
      duration: Number(duration),
      purpose,                        // ← valid enum value
      collateral: collateral?.trim() || null,
      guarantor: guarantor || null,
      creditScore: farmer.creditScore || 720,
      preferredRepaymentMonths,
      linkedTransaction: linkedTransaction || null,
      remarks: remarks?.trim() || null,
      issueDate: new Date(),
      // dueDate will be auto-calculated by pre-save hook
      status: 'Pending',
      repayment: {
        totalPaid: 0,
        history: []
      }
    });

    // Admin Notification
await sendNotification(
  farmer.phone[0], 
  `नमस्ते ${farmer.name} जी!\n\nआपका ₹${amount.toLocaleString('en-IN')} का ${type === 'Advance' ? 'एडवांस' : 'लोन'} आवेदन सफलतापूर्वक जमा हो गया है।\n\nहम 24 घंटे में जवाब देंगे।\nधन्यवाद!\n- Digital Mandi Team`
);

    return res.status(201).json({
      success: true,
      data: {
        loanId: loan._id,
        farmerId: farmerId,
        farmerName: farmer.name,
        amount: loan.amount,
        emiAmount: loan.emiAmount ? Math.round(loan.emiAmount) : null,
        dueDate: loan.dueDate,
        status: loan.status,
        requestedAt: loan.createdAt
      },
      message: 'Loan request submitted successfully!'
    });

  } catch (error) {
    console.error('Loan request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit loan request',
      details: error.message
    });
  }
}
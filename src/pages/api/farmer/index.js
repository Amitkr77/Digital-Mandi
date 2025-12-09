// pages/api/farmer/index.js
import dbConnect from '@/utils/mongoDb';
import Farmer from '@/models/Farmer';
import { sendNotification } from '@/services/notification';
import crypto from 'crypto';

// Helper to generate unique farmerId
const generateFarmerId = () => {
  return 'FRM' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Helper to hash Aadhaar (never store raw Aadhaar!)
const hashAadhaar = (aadhaar) => {
  return crypto.createHash('sha256').update(aadhaar.trim()).digest('hex');
};

export default async function handler(req, res) {
  const { method } = req;
  console.log(method, "farmer api is running");

  await dbConnect();

  if (method === 'POST') {
    const {
      name,
      phone,
      aadhaar,
      village,
      district,
      state = "Uttar Pradesh",
      pin,
      lat,
      lng,
      landHoldingAcres,
      cropsGrown = [],
      bankAccount,
      ifsc,
      bankName,
      photoUrl
    } = req.body;

    // Required fields
    if (!name || !phone || !aadhaar) {
      return res.status(400).json({
        success: false,
        error: "Name, Phone & Aadhaar are required"
      });
    }

    // Clean & validate phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, error: "Invalid Indian phone number" });
    }

    // Validate Aadhaar (12 digits)
    const cleanAadhaar = aadhaar.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      return res.status(400).json({ success: false, error: "Aadhaar must be 12 digits" });
    }

    try {
      // Check duplicate by phone or aadhaar hash
      const aadharHash = hashAadhaar(cleanAadhaar);

      const existing = await Farmer.findOne({
        $or: [
          { phone: cleanPhone },
          { aadharHash }
        ]
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          error: "Farmer already registered with this phone or Aadhaar"
        });
      }

      // Generate GPS array only if both lat & lng provided
      const gps = (lat && lng) ? [parseFloat(lat), parseFloat(lng)] : undefined;

      // Generate unique farmerId
      const farmerId = generateFarmerId();

      const farmer = await Farmer.create({
        farmerId,
        name: name.trim(),
        phone: [cleanPhone], // now an array
        aadharHash,
        address: {
          village: village?.trim(),
          district: district?.trim(),
          state: state.trim(),
          pin: pin?.trim(),
          gps
        },
        photoUrl,
        landSize: landHoldingAcres ? parseFloat(landHoldingAcres) : undefined,
        cropsGrown,
        accountDetails: bankAccount ? {
          accountNo: bankAccount,
          ifscCode: ifsc,
          bankName,
          verified: false
        } : undefined,
        preferredPayment: "UPI",
        status: "pending",           // Fixed: use lowercase
        verificationStatus: "pending",
        registrationDate: new Date()
      });

      // Welcome Notification
      await sendNotification(
        cleanPhone,
        `नमस्ते ${name} जी! आपका Digital Mandi में रजिस्ट्रेशन सफल रहा। आपका Farmer ID: ${farmerId}\nआपकी प्रोफाइल जल्द ही वेरिफाई की जाएगी।`
      );

      return res.status(201).json({
        success: true,
        data: {
          farmerId: farmer.farmerId,
          name: farmer.name,
          phone: farmer.phone[0],
          status: farmer.status,
          message: "Farmer registered successfully! Verification pending."
        }
      });

    } catch (error) {
      console.error('[POST] /api/farmer error:', error);
      return res.status(500).json({
        success: false,
        error: "Failed to register farmer",
        details: error.message
      });
    }
  }

  // GET - List farmers (admin only later)
  if (method === 'GET') {
    try {
      const farmers = await Farmer.find({})
        .select('farmerId name phone village district status verificationStatus landSize createdAt')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: farmers.length,
        data: farmers
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
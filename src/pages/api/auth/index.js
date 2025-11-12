import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import connectDB from "@/utils/mongoDb";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find admin
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Check lock
    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockedUntil - new Date()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Account locked. Try again after ${minutesLeft} minute(s).`,
      });
    }

    // 4. Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementFailedLogin();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 5. Reset attempts
    await admin.resetLoginAttempts();

    // 6. Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Set HttpOnly Cookie
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    res.setHeader("Set-Cookie", [
      `admintoken=${token}`,
      "HttpOnly",
      "Path=/",
      `Max-Age=${sevenDays / 1000}`,
      "SameSite=Strict",
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ].filter(Boolean).join("; "));

    // 8. Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // 9. Respond (without token in body for security)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
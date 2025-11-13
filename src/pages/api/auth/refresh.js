// api/auth/refresh.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import dbConnect from "@/utils/mongoDb";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") return res.status(405).end();

  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  const admin = await Admin.findOne({
    refreshTokenExpires: { $gt: new Date() }
  });

  if (!admin || !(await bcrypt.compare(refreshToken, admin.refreshToken))) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // Optional: Rotate refresh token
  const newRefreshToken = require("crypto").randomBytes(64).toString("hex");
  const hashedNewRT = await bcrypt.hash(newRefreshToken, 10);
  admin.refreshToken = hashedNewRT;
  admin.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await admin.save();

  // New Access Token
  const accessToken = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Update cookies
  res.setHeader("Set-Cookie", [
    `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${15 * 60}`,
    `refresh_token=${newRefreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh; Max-Age=${7 * 24 * 60 * 60}`
  ].join("; "));

  return res.status(200).json({ success: true });
}
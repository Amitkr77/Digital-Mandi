// scripts/seedAdmin.js
import dbConnect from "../utils/mongoDb.js";   
import Admin from "../models/Admin.js";


const SUPER_ADMIN = {
  name: "Super Admin",
  email: "admin@farmhub.com",
  phone: "+919876543210",
  passwordHash: "Admin@123",
};

async function seed() {
  try {
    // Use the cached connection utility
    await dbConnect();
    console.log("Connected to MongoDB (cached)");

    // ---- 1. Check if admin already exists ----
    const exists = await Admin.findOne({ email: SUPER_ADMIN.email });
    if (exists) {
      console.log("Super admin already exists →", exists.email);
      process.exit(0);
    }

    // ---- 2. Create a fresh document (password will be hashed by pre-save) ----
    const admin = new Admin(SUPER_ADMIN);

    await admin.save();
    console.log("Super admin created →", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
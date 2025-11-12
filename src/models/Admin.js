import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;


// ADMIN SCHEMA
const AdminSchema = new Schema(
  {
    // ── Core Identity ──
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Enter a valid international phone number"],
    },

    // ── Authentication & Security ──
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// -------------------------------
// 3. INDEXES
// -------------------------------
AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ phone: 1 });
AdminSchema.index({ role: 1 });

// -------------------------------
// 4. VIRTUALS
// -------------------------------
AdminSchema.virtual("isLocked").get(function () {
  return this.lockedUntil && this.lockedUntil > new Date();
});

// -------------------------------
// 5. METHODS
// -------------------------------

// Hash password before save
AdminSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

// Compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Increment failed login
AdminSchema.methods.incrementFailedLogin = function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); 
  }
  return this.save();
};

// Reset failed attempts on successful login
AdminSchema.methods.resetLoginAttempts = function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = null;
  this.lastLoginAt = new Date();
  return this.save();
};

// Check permission
AdminSchema.methods.hasPermission = function (permission) {
  return (
    this.permissions.includes("dashboard:*") ||
    this.permissions.includes(permission)
  );
};

// -------------------------------
// 6. EXPORT MODEL
// -------------------------------
const Admin = mongoose.models.Admin || model("Admin", AdminSchema);

export default Admin;
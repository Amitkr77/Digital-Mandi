// models/Farmer.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const FarmerSchema = new Schema(
  {
    farmerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: [String],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one phone number is required",
      },
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    address: {
      village: String,
      district: String,
      state: String,
      pin: String,
      gps: {
        type: [Number], // [lat, lng]
        validate: {
          validator: (v) => v.length === 2,
          message: "GPS must contain latitude and longitude",
        },
      },
    },
    aadharHash: {
      type: String,
      required: true,
    },
    photoUrl: String,
    landSize: {
      type: Number,
      min: 0,
    },
    cropsGrown: [String],
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "verified", "pending"],
      default: "pending",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    accountDetails: {
      ifsc: String,
      accountNo: String,
      bankName: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
    preferredPayment: {
      type: String,
      enum: ["UPI", "Bank", "Cash"],
      default: "UPI",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    currentLoan: {
      amount: Number,
      interestRate: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ["active", "repaid", "default"],
      },
    },
    currentProduces: [
      {
        cropType: String,
        quantity: Number,
        season: String,
        expectedYield: Number,
      },
    ],
    ledgerSnapshot: {
      type: [
        {
          date: Date,
          type: {
            type: String,
            enum: ["credit", "debit"],
          },
          amount: Number,
          description: String,
          referenceId: String,
        },
      ],
      validate: {
        validator: (v) => v.length <= 10,
        message: "Ledger snapshot can have at most 10 entries",
      },
    },
    documents: [String],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Farmer = mongoose.model("Farmer", FarmerSchema);
export default Farmer;

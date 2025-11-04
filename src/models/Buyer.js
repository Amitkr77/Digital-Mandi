import mongoose from "mongoose";

const { Schema } = mongoose;

const BuyerSchema = new Schema(
  {
    buyerId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
    },
    businessType: {
      type: String,
      enum: ["Individual", "Retailer", "Wholesaler", "Company"],
      default: "Individual",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },

    address: {
      street: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
    },

    identityType: {
      type: String,
      enum: ["GST", "Aadhar", "Udyam"],
    },
    identityNumber: {
      type: String, 
    },
    photoUrl: {
      type: String,
    },

    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Pending"],
      default: "Active",
    },
    verified: {
      type: Boolean,
      default: false,
    },

    totalPurchase: {
      type: Number,
      default: 0,
    },
    totalQuantityPurchased: {
      type: Number,
      default: 0,
    },

    transactionHistory: [
      {
        transactionId: String,
        farmerId: String,
        product: String,
        quantity: Number,
        amount: Number,
        date: Date,
        paymentStatus: {
          type: String,
          enum: ["Paid", "Pending", "Partially Paid"],
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash"],
    },
    lastPurchaseDate: {
      type: Date,
    },

    farmerInteraction: [String], // list of farmer IDs interacted with

    ratingAndFeedbacks: [
      {
        farmerId: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        feedback: String,
        date: Date,
      },
    ],

    recentOrders: [
      {
        orderId: String,
        product: String,
        amount: Number,
        date: Date,
      },
    ],

    deliveryPreference: {
      type: String,
      enum: ["Self Pickup", "Platform Delivery", "Third Party"],
    },

    notificationPreference: {
      whatsapp: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      email: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Buyer = mongoose.model("Buyer", BuyerSchema);
export default Buyer;

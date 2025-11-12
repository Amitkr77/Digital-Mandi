import mongoose from "mongoose";

const repaymentHistorySchema = new mongoose.Schema({
    date: { 
        type: Date, 
        default: Date.now 
    },
    amount: { 
        type: Number, 
        required: true, 
        min: [0, "Payment amount must be positive"] 
    },
    method: {
        type: String,
        enum: ["Cash", "Bank Transfer", "UPI", "NEFT", "Cheque"], // Expanded options for flexibility
        required: true
    },
    remarks: { type: String, trim: true } // Optional notes per payment
});

const loanSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true,
        index: true // For fast queries by farmer
    },
    farmerName: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["Loan", "Advance"], // Distinguishes buyer advances (interest-free?) from formal loans
        default: "Loan",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, "Loan amount must be at least ₹1"] // Raised min for realism
    },
    interestRate: { // Fixed typo: "intrestRate" -> "interestRate"
        type: Number,
        required: true,
        min: [0, "Interest rate must be non-negative"], // Allows 0% for advances
        max: [36, "Interest rate cannot exceed 36% (RBI cap for microfinance)"] // Compliance nod
    },
    duration: { // In months
        type: Number,
        required: true,
        min: [1, "Duration must be at least 1 month"]
    },
    emiAmount: { // Auto-calculated monthly installment
        type: Number,
        min: [0]
    },
    purpose: {
        type: String,
        enum: ["Seeds/Fertilizer", "Equipment", "Crop Maintenance", "Emergency", "Harvest Advance", "Other"], 
        required: true,
        trim: true
    },
    collateral: { 
        type: String,
        trim: true
    },
    guarantor: { // Optional co-signer
        name: { type: String, trim: true },
        relation: { type: String, trim: true },
        contact: { type: String, trim: true } 
    },
    creditScore: { // Pulled from farmer's produce/transaction history
        type: Number,
        min: 300,
        max: 900,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true 
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Disbursed", "Repaid Partially", "Closed", "Defaulted"], 
        default: "Pending"
    },
    repayment: {
        totalPaid: {
            type: Number,
            default: 0,
        },
        nextDueDate: {
            type: Date,
        },
        history: [repaymentHistorySchema] 
    },
    remarks: {
        type: String,
        trim: true
    },
    linkedTransaction: { // Ties back to produce sales or buyer advances
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction" // Or "Order" if you have that collection
    }
}, {
    timestamps: true 
});

// Indexes for performance (e.g., dashboard queries)
loanSchema.index({ status: 1, dueDate: 1 }); // Quick active/overdue lookups
loanSchema.index({ farmerId: 1, issueDate: -1 }); // Farmer's loan history

// Pre-save hook: Auto-calculate dueDate and EMI (simple flat rate formula; adjust for reducing balance if needed)
loanSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('issueDate') || this.isModified('duration')) {
        this.dueDate = new Date(this.issueDate);
        this.dueDate.setMonth(this.dueDate.getMonth() + this.duration);
        
        // EMI calc: P * r * (1 + r)^n / ((1 + r)^n - 1) where r = monthly rate, n = months
        const principal = this.amount;
        const monthlyRate = this.interestRate / 12 / 100;
        const months = this.duration;
        if (monthlyRate > 0 && months > 0) {
            const power = Math.pow(1 + monthlyRate, months);
            this.emiAmount = principal * monthlyRate * power / (power - 1);
        } else {
            this.emiAmount = principal / months; // Interest-free: equal installments
        }
    }
    
    // Validate dueDate > issueDate
    if (this.dueDate <= this.issueDate) {
        return next(new Error('Due date must be after issue date'));
    }
    
    next();
});

// Post-save hook example: Update farmer's credit score or notify (optional extension)
loanSchema.post('save', function(doc) {
    // e.g., Update farmer doc with latest loan status; integrate with your notification service
    console.log(`Loan ${doc._id} status updated to ${doc.status}`);
});

export default mongoose.model('Loan', loanSchema);
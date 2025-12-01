// models/Repayment.js
const RepaymentSchema = new mongoose.Schema({
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    installmentNo: Number,
    dueDate: Date,
    amountDue: Number,
    amountPaid: { type: Number, default: 0 },
    paidOn: Date,
    paymentMode: String,
    status: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Overdue'] },
});

export default mongoose.models.Repayment || mongoose.model('Repayment', RepaymentSchema);
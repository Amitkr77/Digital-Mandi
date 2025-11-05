"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Wallet, TrendingUp, AlertTriangle, Calendar, PiggyBank, Plus, IndianRupee, CreditCard, Edit3, Trash2, Search } from "lucide-react";

export default function LoanAndAdvanceSection() {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({
    farmerName: "",
    loanType: "",
    principalAmount: "",
    interestRate: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentMode: "cash",
    purpose: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingLoanId, setEditingLoanId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showRepayment, setShowRepayment] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    mode: "cash",
  });

  const initialFormData = {
    farmerName: "",
    loanType: "",
    principalAmount: "",
    interestRate: "",
    startDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentMode: "cash",
    purpose: "",
    status: "Active",
  };

  // Update statuses for overdue loans on mount
  useEffect(() => {
    const nowStr = new Date().toISOString().split("T")[0];
    setLoans((prevLoans) =>
      prevLoans.map((loan) => {
        if (loan.status === "Repaid") return loan;
        if (loan.dueDate && loan.dueDate < nowStr && loan.status !== "Overdue") {
          return { ...loan, status: "Overdue" };
        }
        return loan;
      })
    );
  }, []);

  // Handle save loan (add or update)
  const handleSaveLoan = () => {
    const requiredFields = ["farmerName", "principalAmount", "startDate", "dueDate"];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill required fields: ${missingFields.map((f) => f.replace(/([A-Z])/g, " $1").trim()).join(", ")}`);
      return;
    }
    if (new Date(formData.dueDate) <= new Date(formData.startDate)) {
      setError("Due date must be after start date");
      return;
    }

    const nowStr = new Date().toISOString().split("T")[0];
    let status = formData.status;
    if (status !== "Repaid" && formData.dueDate < nowStr) {
      status = "Overdue";
    }

    const loanData = {
      ...formData,
      status,
      principalAmount: Number(formData.principalAmount),
      interestRate: Number(formData.interestRate) || 0,
    };

    if (isEditing && editingLoanId) {
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === editingLoanId
            ? { ...loanData, id: editingLoanId, repayments: loan.repayments || [], totalPaid: loan.totalPaid || 0 }
            : loan
        )
      );
    } else {
      setLoans((prevLoans) => [...prevLoans, { ...loanData, id: Date.now(), repayments: [], totalPaid: 0 }]);
    }

    resetForm();
    setError("");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingLoanId(null);
  };

  const handleEditLoan = (loan) => {
    setFormData({
      ...loan,
      principalAmount: loan.principalAmount.toString(),
      interestRate: loan.interestRate.toString(),
    });
    setIsEditing(true);
    setEditingLoanId(loan.id);
    setError("");
  };

  const handleDeleteLoan = (id) => {
    if (confirm("Are you sure you want to delete this loan? This action cannot be undone.")) {
      setLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== id));
    }
  };

  const handleAddPayment = () => {
    if (!paymentData.amount || Number(paymentData.amount) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    const paymentAmount = Number(paymentData.amount);
    const newTotalPaid = (selectedLoan.totalPaid || 0) + paymentAmount;
    const principal = Number(selectedLoan.principalAmount);
    let newStatus = selectedLoan.status;
    if (newTotalPaid >= principal) {
      newStatus = "Repaid";
    }

    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === selectedLoan.id
          ? {
              ...loan,
              totalPaid: newTotalPaid,
              status: newStatus,
              repayments: [
                ...(loan.repayments || []),
                { id: Date.now(), amount: paymentAmount, date: paymentData.date, mode: paymentData.mode },
              ],
            }
          : loan
      )
    );

    setShowRepayment(false);
    setPaymentData({ amount: "", date: new Date().toISOString().split("T")[0], mode: "cash" });
    setSelectedLoan(null);
  };

  const handleRepaymentClick = (loan) => {
    setSelectedLoan(loan);
    setPaymentData({ amount: "", date: new Date().toISOString().split("T")[0], mode: "cash" });
    setShowRepayment(true);
  };

  // Calculate totals
  const totals = useMemo(() => {
    const activeLoans = loans.filter((l) => l.status === "Active").length;
    const repaidLoans = loans.filter((l) => l.status === "Repaid").length;
    const overdueLoans = loans.filter((l) => l.status === "Overdue").length;
    const totalAmount = loans.reduce((acc, l) => acc + Number(l.principalAmount || 0), 0);
    const totalOutstanding = loans.reduce((acc, l) => acc + (Number(l.principalAmount || 0) - (l.totalPaid || 0)), 0);
    return { activeLoans, repaidLoans, overdueLoans, totalAmount, totalOutstanding };
  }, [loans]);

  const filteredLoans = useMemo(() => {
    return loans.filter(
      (loan) =>
        loan.farmerName.toLowerCase().includes(search.toLowerCase()) ||
        loan.loanType.toLowerCase().includes(search.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(search.toLowerCase())
    );
  }, [loans, search]);

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Loans & Advances Management</h2>
        <p className="text-sm text-gray-500">Logged in as: <strong>Ashish Kumar</strong> (Staff Member)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={<PiggyBank />} title="Total Amount" value={`₹${totals.totalAmount.toLocaleString()}`} />
        <SummaryCard icon={<TrendingUp />} title="Active Loans" value={totals.activeLoans} />
        <SummaryCard icon={<Wallet />} title="Repaid Loans" value={totals.repaidLoans} />
        <SummaryCard icon={<AlertTriangle />} title="Overdue Loans" value={totals.overdueLoans} />
        <SummaryCard icon={<CreditCard />} title="Outstanding" value={`₹${totals.totalOutstanding.toLocaleString()}`} color="text-red-600" />
      </div>

      {/* Add/Edit Loan Form */}
      <div
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" /> {isEditing ? "Edit Loan" : "Add New Loan / Advance"}
        </h3>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Farmer Name *" value={formData.farmerName} onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })} required />
          <Select label="Loan Type" value={formData.loanType} onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}>
            <option value="">Select Type</option>
            <option value="Crop Loan">Crop Loan</option>
            <option value="Personal Advance">Personal Advance</option>
            <option value="Equipment">Equipment</option>
            <option value="Emergency">Emergency</option>
          </Select>
          <Input label="Principal Amount (₹) *" type="number" min="0" step="0.01" value={formData.principalAmount} onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })} required />
          <Input label="Interest Rate (%)" type="number" min="0" max="100" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })} />
          <Input label="Start Date *" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
          <Input label="Due Date *" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
          <Select label="Payment Mode" value={formData.paymentMode} onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank</option>
            <option value="credit">Credit</option>
          </Select>
          <Input label="Purpose" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
          <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
            <option value="Active">Active</option>
            <option value="Repaid">Repaid</option>
            <option value="Overdue">Overdue</option>
          </Select>
        </div>

        <div className="flex gap-2 mt-4">
          {isEditing && (
            <button
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSaveLoan}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            {isEditing ? "Update Loan" : "Add Loan"}
          </button>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-blue-600" /> Loan Records ({filteredLoans.length})
          </h3>
          <Input
            label=""
            placeholder="Search by farmer, type, or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
            icon={<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
          />
        </div>
        {filteredLoans.length === 0 ? (
          <p className="text-gray-500 text-sm">No loans recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-left">Farmer</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Amount (₹)</th>
                  <th className="p-2 text-left">Interest (%)</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2 text-left">Due</th>
                  <th className="p-2 text-left">Mode</th>
                  <th className="p-2 text-left">Total Paid (₹)</th>
                  <th className="p-2 text-left">Pending (₹)</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const totalPaid = loan.totalPaid || 0;
                  const pending = Number(loan.principalAmount) - totalPaid;
                  return (
                    <tr
                      key={loan.id}
                      className="border-b hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="p-2">{loan.farmerName}</td>
                      <td className="p-2">{loan.loanType || "-"}</td>
                      <td className="p-2">₹{Number(loan.principalAmount).toLocaleString()}</td>
                      <td className="p-2">{loan.interestRate || 0}%</td>
                      <td className="p-2">{loan.startDate || "-"}</td>
                      <td className="p-2">{loan.dueDate || "-"}</td>
                      <td className="p-2 capitalize">{loan.paymentMode}</td>
                      <td className="p-2">₹{totalPaid.toLocaleString()}</td>
                      <td className={`p-2 font-medium ${pending <= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₹{pending.toLocaleString()}
                      </td>
                      <td
                        className={`p-2 font-medium ${
                          loan.status === "Repaid"
                            ? "text-green-600"
                            : loan.status === "Overdue"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {loan.status}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditLoan(loan)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit Loan"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRepaymentClick(loan)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Add Payment"
                          >
                            <CreditCard className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLoan(loan.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete Loan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Repayment Modal */}
      {showRepayment && selectedLoan && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            <h3 className="text-lg font-semibold mb-4">Add Payment for {selectedLoan.farmerName}</h3>
            <p className="text-sm text-gray-500 mb-4">Pending: ₹{ (Number(selectedLoan.principalAmount) - (selectedLoan.totalPaid || 0)).toLocaleString() }</p>
            <div className="space-y-4">
              <Input
                label="Payment Amount (₹)"
                type="number"
                min="0"
                step="0.01"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              />
              <Input
                label="Payment Date"
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
              />
              <Select
                label="Payment Mode"
                value={paymentData.mode}
                onChange={(e) => setPaymentData({ ...paymentData, mode: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank</option>
                <option value="credit">Credit</option>
              </Select>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowRepayment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Component
const Input = ({ label, icon, className = "", ...props }) => (
  <div className="relative">
    {label && <label className="text-sm text-gray-600 block mb-1">{label}</label>}
    <div className={icon ? "relative" : ""}>
      {icon}
      <input
        {...props}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none pr-10 ${className} ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

// Reusable Select Component
const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label className="text-sm text-gray-600 block mb-1">{label}</label>}
    <select
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
    >
      {children}
    </select>
  </div>
);

// Summary Card Component
const SummaryCard = ({ icon, title, value, color = "text-green-600" }) => (
  <div
    className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between"
  >
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h4 className="text-lg font-semibold text-gray-800">{value}</h4>
    </div>
    <div className={color}>{icon}</div>
  </div>
);
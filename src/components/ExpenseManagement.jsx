"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Wallet,
  IndianRupee,
  Calendar,
  FileText,
  Truck,
  User,
} from "lucide-react";

export default function ExpenseManagement() {
  const mockFarmers = [
    "Anil Sharma",
    "Priya Singh",
    "Rajesh Kumar",
    "Sunita Devi",
    "Vikram Singh",
  ];

  const categories = [
    "fare",
    "Transport",
    "Labour",
    "Packaging",
    "Fuel",
    "Rent",
    "Misc",
  ];

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2025-11-05",
      type: "Transport",
      farmer: "Anil Sharma",
      description: "Truck hire for delivery",
      amount: 1200,
      paymentType: "cash",
      status: "Paid",
    },
    {
      id: 2,
      date: "2025-11-04",
      type: "Labour",
      farmer: "Priya Singh",
      description: "Loading charges",
      amount: 800,
      paymentType: "UPI",
      status: "Pending",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    date: "",
    type: "",
    farmer: "",
    description: "",
    amount: "",
    paymentType: "cash",
    status: "Paid",
  });

  const addExpense = () => {
    if (!newExpense.date || !newExpense.type || newExpense.amount <= 0) {
      alert("Please fill all required fields!");
      return;
    }

    setExpenses([{ ...newExpense, id: Date.now() }, ...expenses]);
    setNewExpense({
      date: "",
      type: "",
      farmer: "",
      description: "",
      amount: "",
      paymentType: "cash",
      status: "Paid",
    });
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Totals
  const summary = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const paid = expenses
      .filter((e) => e.status === "Paid")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const pending = total - paid;
    return { total, paid, pending };
  }, [expenses]);

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-blue-600" />
          <span className="font-medium">
            Logged in as: <strong>Ashish Kumar</strong> (Staff Member)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column – Add Expense */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Add New Expense
          </h3>

          <div className="space-y-3">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Date
              </label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expense Type
              </label>
              <select
                value={newExpense.type}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Type --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Farmer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farmer (if applicable)
              </label>
              <input
                type="text"
                list="farmers"
                value={newExpense.farmer}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, farmer: e.target.value })
                }
                placeholder="Search or type farmer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="farmers">
                {mockFarmers.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                placeholder="Enter brief description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>

            {/* Payment & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={newExpense.paymentType}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      paymentType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newExpense.status}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <button
              onClick={addExpense}
              className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </div>
        </div>

        {/* Right Column – Summary & Expense List */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xl font-semibold text-blue-700">
                ₹{summary.total.toFixed(0)}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl font-semibold text-green-700">
                ₹{summary.paid.toFixed(0)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-red-700">
                ₹{summary.pending.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Expense List */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              Recent Expenses
            </h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Farmer</th>
                  <th className="text-left py-2 font-medium">Amount</th>
                  <th className="text-left py-2 font-medium">Payment</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2">{exp.date}</td>
                    <td className="py-2">{exp.type}</td>
                    <td className="py-2">{exp.farmer || "-"}</td>
                    <td className="py-2 font-semibold text-gray-800">
                      ₹{exp.amount}
                    </td>
                    <td className="py-2 capitalize">{exp.paymentType}</td>
                    <td
                      className={`py-2 font-medium ${
                        exp.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {exp.status}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removeExpense(exp.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {expenses.length === 0 && (
              <p className="text-gray-400 text-center py-4 italic">
                No expenses recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

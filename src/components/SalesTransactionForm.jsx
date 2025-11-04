'use client';

import { useState, useMemo } from "react";
import { Plus, Trash2, User, ShoppingCart, IndianRupee, Package, Users } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "./ui/separator";

const mockFarmers = ["Anil Sharma", "Priya Singh", "Rajesh Kumar", "Sunita Devi", "Vikram Singh"];
const mockBuyers = ["Shree Traders", "AgroMart Ltd", "City Grain Co", "Ramesh Wholesaler", "Local Mill"];
const mockProducts = ["Wheat", "Rice", "Soybean", "Maize", "Pulses", "Sugarcane"];

const generateLotNo = () => `LOT${String(Math.floor(1000 + Math.random() * 9000))}`;

export default function SalesTransactionForm() {
  const [farmerName, setFarmerName] = useState("");
  const [manualCommission, setManualCommission] = useState(2.5);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const [entries, setEntries] = useState([
    {
      id: 1,
      buyer: "",
      paymentType: "cash",
      product: "",
      price: 0,
      quantity: 0,
      buyerCommission: 0,
    },
  ]);

  const [recentEntries, setRecentEntries] = useState([
    { lotNo: "LOT8921", seller: "Anil Sharma", buyer: "Shree Traders", netAmount: "₹8,190" },
    { lotNo: "LOT8920", seller: "Priya Singh", buyer: "AgroMart Ltd", netAmount: "₹12,050" },
  ]);

  // Add new buyer entry
  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: Date.now(),
        buyer: "",
        paymentType: "cash",
        product: "",
        price: 0,
        quantity: 0,
        buyerCommission: 0,
      },
    ]);
  };

  // Remove entry
  const removeEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Update entry
  const updateEntry = (id, field, value) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  // Calculations
  const calculations = useMemo(() => {
    const grossAmount = entries.reduce((sum, e) => sum + e.price * e.quantity, 0);
    const farmerCommission = grossAmount * (manualCommission / 100);
    const totalBuyerCommission = entries.reduce((sum, e) => sum + e.buyerCommission, 0);
    const totalPayable = grossAmount - farmerCommission - otherExpenses;

    return {
      grossAmount,
      farmerCommission,
      totalBuyerCommission,
      totalPayable,
      commissionCollected: farmerCommission + totalBuyerCommission,
    };
  }, [entries, manualCommission, otherExpenses]);

  // Generate Bill
  const handleGenerateBill = () => {
    if (!farmerName || entries.some((e) => !e.buyer || !e.product || e.price <= 0 || e.quantity <= 0)) {
      alert("Please fill all required fields.");
      return;
    }

    const lotNo = generateLotNo();
    const newEntry = {
      lotNo,
      seller: farmerName,
      buyer: entries.map((e) => e.buyer).join(", "),
      netAmount: `₹${calculations.totalPayable.toFixed(0)}`,
    };

    setRecentEntries([newEntry, ...recentEntries.slice(0, 4)]);
    alert(`Bill generated! LOT: ${lotNo}`);
    
    // Reset form
    setFarmerName("");
    setManualCommission(2.5);
    setOtherExpenses(0);
    setEntries([{
      id: Date.now(),
      buyer: "",
      paymentType: "cash",
      product: "",
      price: 0,
      quantity: 0,
      buyerCommission: 0,
    }]);
  };

  return (
    <>
       <div className="container mx-auto ">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Logged in as: <strong>Ashish Kumar</strong> (Staff Member)</span>
            </div>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" /> New Transaction
            </button> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Seller & Summary */}
            <div className="space-y-6">
              {/* Quick Entry */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Quick Entry
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name</label>
                    <input
                      type="text"
                      list="farmers"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search or type farmer name"
                    />
                    <datalist id="farmers">
                      {mockFarmers.map((f) => (
                        <option key={f} value={f} />
                      ))}
                    </datalist>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manual Commission (%)</label>
                      <input
                        type="number"
                        value={manualCommission}
                        onChange={(e) => setManualCommission(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Other Expenses (₹)</label>
                      <input
                        type="number"
                        value={otherExpenses}
                        onChange={(e) => setOtherExpenses(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Amount</span>
                    <span className="font-medium">₹{calculations.grossAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Farmer Commission ({manualCommission}%)</span>
                    <span className="font-medium text-red-600">-₹{calculations.farmerCommission.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other Expenses</span>
                    <span className="font-medium text-red-600">-₹{otherExpenses}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total Payable Amount</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{calculations.totalPayable.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commission Collected */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Commission Collected</h3>
                <p className="text-2xl font-bold text-green-700">
                  ₹{calculations.commissionCollected.toFixed(0)}
                </p>
              </div>

              {/* Generate Bill */}
              <button
                onClick={handleGenerateBill}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Generate Bill
              </button>
            </div>

            {/* Right Column: Buyer & Payment */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Buyer & Payment
                  </h3>
                  <button
                    onClick={addEntry}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" /> Add Another Entry
                  </button>
                </div>

                <div className="space-y-6 ">
                  {entries.map((entry, idx) => (
                    <div key={entry.id} className="border rounded-lg p-4 relative">
                      {entries.length > 1 && (
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Buyer</label>
                          <input
                            type="text"
                            list={`buyers-${entry.id}`}
                            value={entry.buyer}
                            onChange={(e) => updateEntry(entry.id, "buyer", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Select buyer"
                          />
                          <datalist id={`buyers-${entry.id}`}>
                            {mockBuyers.map((b) => (
                              <option key={b} value={b} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`payment-${entry.id}`}
                                checked={entry.paymentType === "cash"}
                                onChange={() => updateEntry(entry.id, "paymentType", "cash")}
                                className="mr-2"
                              />
                              <span>Cash</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`payment-${entry.id}`}
                                checked={entry.paymentType === "credit"}
                                onChange={() => updateEntry(entry.id, "paymentType", "credit")}
                                className="mr-2"
                              />
                              <span>Credit</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                          <input
                            type="text"
                            list={`products-${entry.id}`}
                            value={entry.product}
                            onChange={(e) => updateEntry(entry.id, "product", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="Select product"
                          />
                          <datalist id={`products-${entry.id}`}>
                            {mockProducts.map((p) => (
                              <option key={p} value={p} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/unit)</label>
                          <input
                            type="number"
                            value={entry.price}
                            onChange={(e) => updateEntry(entry.id, "price", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Kg)</label>
                          <input
                            type="number"
                            value={entry.quantity}
                            onChange={(e) => updateEntry(entry.id, "quantity", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md font-medium">
                            ₹{(entry.price * entry.quantity).toFixed(0)}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Buyer Commission (₹)</label>
                          <input
                            type="number"
                            value={entry.buyerCommission}
                            onChange={(e) => updateEntry(entry.id, "buyerCommission", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Recent Entries */}
          <div className="">
            <h3 className="text-lg font-semibold mb-4">Your Recent Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">LOT NO.</th>
                    <th className="text-left py-2 font-medium">SELLER</th>
                    <th className="text-left py-2 font-medium">BUYER</th>
                    <th className="text-left py-2 font-medium">NET AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{entry.lotNo}</td>
                      <td className="py-3">{entry.seller}</td>
                      <td className="py-3 text-gray-600">{entry.buyer}</td>
                      <td className="py-3 font-semibold text-green-600">{entry.netAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  );
}
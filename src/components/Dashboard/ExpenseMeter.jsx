"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Calendar,
  Fuel,
  Wrench,
  Package2,
  MoreHorizontal,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


/* -------------------------------------------------
   Tiny toast implementation (no external deps)
   ------------------------------------------------- */
let toastId = 0;

const ToastContainer = ({
  toasts,
  remove,
}) => {
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 rounded-lg bg-background p-4 shadow-lg border animate-in slide-in-from-bottom"
        >
          <div className="flex-1">
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => remove(t.id)}
            className="h-6 w-6"
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  );
};

/* -------------------------------------------------
   ExpenseMeter component
   ------------------------------------------------- */
const ExpenseMeter = () => {
  const [range, setRange] = useState("daily");
  const [budget, setBudget] = useState({ daily: 25000, monthly: 350000 });
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState({ daily: "", monthly: "" });
  const [toasts, setToasts] = useState([]);

  const showToast = (title, description) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, description }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dailyExpenses = [
    { name: "Fuel & Transport", value: 8400, color: "#f59e0b" },
    { name: "Labor", value: 6200, color: "#3b82f6" },
    { name: "Packaging", value: 3100, color: "#10b981" },
    { name: "Maintenance", value: 1800, color: "#ef4444" },
    { name: "Miscellaneous", value: 900, color: "#8b5cf6" },
  ];

  const monthlyExpenses = [
    { name: "Fuel & Transport", value: 124000, color: "#f59e0b" },
    { name: "Labor", value: 98000, color: "#3b82f6" },
    { name: "Packaging", value: 52000, color: "#10b981" },
    { name: "Maintenance", value: 38000, color: "#ef4444" },
    { name: "Rent & Utilities", value: 45000, color: "#8b5cf6" },
  ];

  const data = range === "daily" ? dailyExpenses : monthlyExpenses;
  const total = data.reduce((s, i) => s + i.value, 0);
  const prevTotal = range === "daily" ? 18400 : 312000;
  const change = ((total - prevTotal) / prevTotal) * 100;
  const isUp = change > 0;

  const currentBudget = budget[range];
  const budgetPercent = (total / currentBudget) * 100;
  const isWarning = budgetPercent >= 80 && budgetPercent < 100;
  const isDanger = budgetPercent >= 100;

  const topExpenses = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((it, i) => ({ ...it, rank: i + 1 }));

  const fmt = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? "text-red-600" : "text-green-600";

  /* ---------- Export CSV ---------- */
  const exportToCSV = () => {
    const headers = ["Category", "Amount (₹)"];
    const rows = data.map((d) => [d.name, d.value]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute(
      "download",
      `expense-report-${range}-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Report Exported", `Expense report for ${range} saved as CSV.`);
  };

  /* ---------- Budget edit ---------- */
  const handleSaveBudget = () => {
    const newVal = parseInt(tempBudget[range]) || budget[range];
    setBudget((b) => ({ ...b, [range]: newVal }));
    setEditingBudget(false);
    showToast("Budget Updated", "Your budget limits have been saved.");
  };

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Expense Meter</CardTitle>
              <CardDescription>
                {range === "daily" ? "Today's" : "This month's"} spending
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>

              <div className="flex rounded-md border bg-muted p-1">
                <Button
                  size="sm"
                  variant={range === "daily" ? "default" : "ghost"}
                  className={cn(
                    "h-8 px-3 text-xs",
                    range === "daily" && "shadow-sm"
                  )}
                  onClick={() => setRange("daily")}
                >
                  Daily
                </Button>
                <Button
                  size="sm"
                  variant={range === "monthly" ? "default" : "ghost"}
                  className={cn(
                    "h-8 px-3 text-xs",
                    range === "monthly" && "shadow-sm"
                  )}
                  onClick={() => setRange("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Total + Budget Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{fmt(total)}</span>
                <Badge
                  variant="outline"
                  className={cn("flex items-center gap-1", trendColor)}
                >
                  <TrendIcon className="h-3 w-3" />
                  {Math.abs(change).toFixed(1)}%
                </Badge>
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Budget bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Budget: {fmt(currentBudget)}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    isDanger && "text-red-600",
                    isWarning && "text-amber-600",
                    !isWarning && !isDanger && "text-green-600"
                  )}
                >
                  {budgetPercent.toFixed(0)}% used
                </span>
              </div>
              <Progress
                value={Math.min(budgetPercent, 100)}
                className={cn(
                  "h-2",
                  isDanger && "[&>div]:bg-red-500",
                  isWarning && "[&>div]:bg-amber-500",
                  !isWarning && !isDanger && "[&>div]:bg-green-500"
                )}
              />
              {isDanger && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  Budget exceeded by {fmt(total - currentBudget)}
                </p>
              )}
              {isWarning && !isDanger && (
                <p className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  Approaching limit
                </p>
              )}
            </div>

            {/* Edit budget */}
            <div className="flex items-center justify-between">
              {editingBudget ? (
                <div className="flex items-center gap-2 text-sm">
                  <Label className="w-12">₹</Label>
                  <Input
                    type="number"
                    value={tempBudget[range]}
                    onChange={(e) =>
                      setTempBudget({ ...tempBudget, [range]: e.target.value })
                    }
                    className="h-8 w-24"
                    placeholder={currentBudget.toString()}
                  />
                  <Button size="sm" onClick={handleSaveBudget}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingBudget(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTempBudget({
                      daily: budget.daily.toString(),
                      monthly: budget.monthly.toString(),
                    });
                    setEditingBudget(true);
                  }}
                >
                  Edit Budget
                </Button>
              )}
            </div>
          </div>

          {/* Chart + List */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart */}
            <div className="flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((e, i) => (
                      <Cell key={`cell-${i}`} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => fmt(v)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(v) => (
                      <span className="text-xs text-muted-foreground">
                        {v}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Expenses */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Top Expenses
              </p>
              {topExpenses.map((exp) => (
                <div
                  key={exp.name}
                  className="flex items-center justify-between rounded-md bg-card p-3 shadow-sm transition hover:shadow"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white",
                        exp.rank === 1 && "bg-yellow-500",
                        exp.rank === 2 && "bg-gray-400",
                        exp.rank === 3 && "bg-orange-600"
                      )}
                    >
                      {exp.rank}
                    </div>

                    <div className="flex items-center gap-2">
                      {exp.name.includes("Fuel") && (
                        <Fuel className="h-4 w-4 text-amber-600" />
                      )}
                      {exp.name.includes("Labor") && (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                      {exp.name.includes("Packaging") && (
                        <Package2 className="h-4 w-4 text-green-600" />
                      )}
                      {exp.name.includes("Maintenance") && (
                        <Wrench className="h-4 w-4 text-red-600" />
                      )}
                      {exp.name.includes("Rent") && (
                        <MoreHorizontal className="h-4 w-4 text-purple-600" />
                      )}
                      <span className="font-medium text-sm">{exp.name}</span>
                    </div>
                  </div>

                  <span className="font-semibold text-sm">
                    {fmt(exp.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast container */}
      <ToastContainer toasts={toasts} remove={removeToast} />
    </>
  );
};

export default ExpenseMeter;
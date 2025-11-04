"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  CreditCard,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SalesChart from "./SalesChart";
import CommissionDonut from "./CommissionDonut";
import TopPerformers from "./TopPerformers";
import RecentActivity from "./RecentActivity";

const DashboardContent = () => {
  const [chartRange, setChartRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Daily Sales"
          value="₹1,84,520"
          change="+5.2%"
          trend="up"
          icon={DollarSign}
          color="text-green-600"
        />
        <KPICard
          title="Produce Sold Today"
          value="2,840 kg"
          change="+12.8%"
          trend="up"
          icon={Package}
          color="text-blue-600"
        />
        <KPICard
          title="Commissions Earned"
          value="₹9,226"
          change="+3.1%"
          trend="up"
          icon={TrendingUp}
          color="text-emerald-600"
        />
        <KPICard
          title="Outstanding Credit"
          value="₹42,300"
          change="-8.4%"
          trend="down"
          icon={CreditCard}
          color="text-red-600"
          note="Decreased from yesterday"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Overview</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={chartRange === "7d" ? "default" : "outline"}
                  onClick={() => setChartRange("7d")}
                >
                  7 Days
                </Button>
                <Button
                  size="sm"
                  variant={chartRange === "30d" ? "default" : "outline"}
                  onClick={() => setChartRange("30d")}
                >
                  30 Days
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart range={chartRange} />
          </CardContent>
        </Card>

        {/* Commission Donut */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
            <CardDescription>Farmers vs Buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <CommissionDonut />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <TopPerformers />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reusable KPI Card
const KPICard = ({ title, value, change, trend, icon: Icon, color, note }) => {
  const isPositive =
    trend === "up" || (change.includes("-") && title.includes("Credit"));
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = title.includes("Credit")
    ? change.includes("-")
      ? "text-green-600"
      : "text-red-600"
    : isPositive
    ? "text-green-600"
    : "text-red-600";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          <ChangeIcon className={`h-3 w-3 ${changeColor}`} />
          <span className={changeColor}>{change}</span>
          {note && <span className="text-muted-foreground ml-1">{note}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;

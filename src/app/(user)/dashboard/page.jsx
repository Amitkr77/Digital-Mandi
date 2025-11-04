"use client";

import { useState } from "react";
import { Plus, ShoppingBag, UserPlus, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import AddFarmerModal from "@/components/modals/AddFarmerModal";
import RecordSaleModal from "@/components/modals/RecordSaleModal";
import AddBuyerModal from "@/components/modals/AddBuyerModal";

export default function DashboardPage() {
  const [openFarmer, setOpenFarmer] = useState(false);
  const [openSale, setOpenSale] = useState(false);
  const [openBuyer, setOpenBuyer] = useState(false);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Digital Mandi Dashboard</h1>
          <p className="text-muted-foreground">Monitor sales, farmers, buyers, and operations in real time.</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setOpenSale(true)} size="sm">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Record Sale
          </Button>
          <Button onClick={() => setOpenFarmer(true)} size="sm" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Farmer
          </Button>
          <Button onClick={() => setOpenBuyer(true)} size="sm" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Buyer
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardContent />

      {/* Modals */}
      <AddFarmerModal open={openFarmer} onOpenChange={setOpenFarmer} />
      <RecordSaleModal open={openSale} onOpenChange={setOpenSale} />
      <AddBuyerModal open={openBuyer} onOpenChange={setOpenBuyer} />
    </>
  );
}
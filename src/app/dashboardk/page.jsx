// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import BuyerDashboard from "@/components/Dashboard/BuyerDashboard"; // create this
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role || !["farmer", "buyer"].includes(role)) {
      router.replace("/"); // send back to landing if no role
    }
  }, [router]);

  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </div>
      }>
        {role === "farmer" ? <DashboardContent /> : <BuyerDashboard />}
      </Suspense>
    </DashboardLayout>
  );
}
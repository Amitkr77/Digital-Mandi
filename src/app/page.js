// src/app/page.js
"use client";

import { useState } from "react";
import Login from "@/components/auth/Login";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (email, password) => {
    console.log("Login attempt:", { email, password });
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout>
    <DashboardContent />
    </DashboardLayout>
  );
}
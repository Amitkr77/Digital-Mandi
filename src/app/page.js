"use client";

import { useState } from "react";
import Login from "@/components/auth/Login";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (

    <>
      <DashboardContent />
    </>

  );
}
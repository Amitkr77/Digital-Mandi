// src/app/login/page.tsx
"use client";

import Login from "@/components/auth/Login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Optional: read ?redirect query param
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.push(redirect || "/dashboard");
  };

  return <Login onLoginSuccess={handleSuccess} />;
}
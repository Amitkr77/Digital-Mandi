// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, User, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    const email = localStorage.getItem("adminEmail") || "admin@example.com";

    if (!name) {
      // Not logged in → redirect to home (login)
      toast.error("Please log in first");
      router.push("/");
      return;
    }

    setAdminName(name);
    setAdminEmail(email);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border border-gray-200">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <Avatar className="h-28 w-28 border-4 border-green-600">
                <AvatarFallback className="text-3xl font-bold bg-green-600 text-white">
                  {adminName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              {adminName}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Admin • Digital Mandi Platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Info Rows */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-700">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{adminName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-700">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{adminEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-700">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">November 2025</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Digital Mandi Admin Panel • Bihar, India</p>
          <p className="mt-1">Current time: {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        </div>
      </div>
    </div>
  );
}
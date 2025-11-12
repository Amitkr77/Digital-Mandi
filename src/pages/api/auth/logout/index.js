// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export default async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the admintoken cookie
  response.cookies.set({
    name: "admintoken",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
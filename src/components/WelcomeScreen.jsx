// src/components/WelcomeScreen.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wheat, Truck, Handshake } from "lucide-react";

export default function WelcomeScreen({ onComplete }) {

  const handleGetStarted = () => {
    // Celebrate!
   

    // Mark as seen permanently
    localStorage.setItem("hasSeenDigitalMandiWelcome", "true");

    // Small delay so user sees confetti, then go to dashboard
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-green-700 via-green-600 to-emerald-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff'%3E%3Cpath d='M0 50a50 50 0 1 1 100 0A50 50 0 1 1 0 50' fill-opacity='0.05'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="text-center px-6 max-w-4xl relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          className="mb-8 inline-block"
        >
          <div className="p-8 bg-white/25 backdrop-blur-md rounded-full shadow-2xl">
            <Wheat className="w-28 h-28 md:w-36 md:h-36 text-green-100" />
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          डिजिटल <span className="text-yellow-300 drop-shadow-2xl">मंडी</span>
        </h1>

        <p className="text-3xl md:text-5xl font-bold text-green-100 mb-8 leading-snug">
          अब किसान सीधे व्यापारी को बेचे
        </p>
        <p className="text-2xl md:text-4xl font-semibold text-green-200 mb-12">
          बिचौलिए हटे • सही दाम • तुरंत पेमेंट
        </p>

        <div className="flex flex-wrap justify-center gap-10 md:gap-gap-16 my-12 text-green-100">
          <div className="text-center">
            <Handshake className="w-16 h-16 mx-auto mb-3" />
            <p className="text-xl font-bold">सीधा सौदा</p>
          </div>
          <div className="text-center">
            <Truck className="w-16 h-16 mx-auto mb-3" />
            <p className="text-xl font-bold">घर से पिकअप</p>
          </div>
          <div className="text-center">
            <Wheat className="w-16 h-16 mx-auto mb-3" />
            <p className="text-xl font-bold">बेस्ट रेट</p>
          </div>
        </div>

        {/* This button is the ONLY way to proceed */}
        <Button
          onClick={handleGetStarted}
          className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-black text-2xl md:text-3xl px-16 py-10 rounded-full shadow-2xl transform transition hover:scale-110 active:scale-95"
        >
          अभी शुरू करें →
        </Button>

        <p className="mt-12 text-green-200 text-lg md:text-xl font-medium">
          भारत के किसानों के लिए बना भरोसेमंद प्लेटफॉर्म
        </p>
      </motion.div>
    </div>
  );
}
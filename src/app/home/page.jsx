"use client";

import React, { useState } from "react";
import {
  Wheat,
  Truck,
  Handshake,
  ArrowRight,
  Tractor,
  Shield,
  Check,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Page() {
  const [lang, setLang] = useState("hi");

  const content = {
    hi: {
      title: "डिजिटल मंडी",
      subtitle: "किसान और व्यापारी का भरोसेमंद साथ",
      tagline: "बिचौलिए हटाओ • सही दाम पाओ • तुरंत पेमेंट",
      cta: "मुफ्त में शुरू करें",
      trust: "लाखों किसानों का भरोसा • 100% सुरक्षित",
      features: [
        {
          icon: Handshake,
          title: "सीधा सौदा",
          desc: "बिचौलियों के बिना, सीधे व्यापारी से जुड़ें",
        },
        {
          icon: Truck,
          title: "घर से पिकअप",
          desc: "खेत से सीधा माल उठाव, बिना परेशानी",
        },
        {
          icon: Wheat,
          title: "बेस्ट रेट गारंटी",
          desc: "लाइव बाजार भाव और पारदर्शी बोली",
        },
      ],
    },
    en: {
      title: "Digital Mandi",
      subtitle: "Direct. Fair. Fast.",
      tagline: "No Middlemen • Best Prices • Instant Payment",
      cta: "Get Started Free",
      trust: "Trusted by farmers across India • 100% secure",
      features: [
        {
          icon: Handshake,
          title: "Direct Deals",
          desc: "Connect directly with buyers & processors",
        },
        {
          icon: Truck,
          title: "Doorstep Pickup",
          desc: "We collect produce directly from your farm",
        },
        {
          icon: Wheat,
          title: "Best Price Guarantee",
          desc: "Live rates with transparent bidding",
        },
      ],
    },
  };

  const t = content[lang];

  return (
    <>
      {/* Floating Language Switcher */}
      <button
        onClick={() => setLang(lang === "hi" ? "en" : "hi")}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl transition-all"
      >
        {/* <Globe className="w-4 h-4" /> */}
        <img src="./translating.png" alt="" className="h-8 w-8" />
        {lang === "hi" ? "English" : "हिंदी"}
      </button>

      {/* Hero Section */}
      <div className="min-h-screen bg-linear-to-br from-emerald-500 via-white to-amber-50 flex items-center justify-center px-5 py-16">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left space-y-10"
            >
              {/* Logo + Title */}
              <div className="flex flex-col items-center lg:items-start gap-6">
                <div className="p-5 bg-emerald-600 rounded-3xl shadow-2xl inline-block">
                  <Wheat className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>

                <div className="space-y-3">
                  <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
                    {t.title}
                  </h1>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-700">
                    {t.subtitle}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto lg:mx-0">
                {t.tagline}
              </p>

              {/* CTA */}
              <div className="pt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xl px-16 py-10 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 flex items-center gap-5 mx-auto lg:mx-0"
                    >
                      <span className="relative z-10 flex items-center gap-4">
                        {lang === "hi" ? "शुरू करें" : "Get Started"}
                        <ArrowRight className="w-9 h-9 group-hover:translate-x-3 transition" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Button>
                  </DialogTrigger>

                  {/* Beautiful Role Selection Dialog */}
                  <DialogContent className="sm:max-w-2xl p-8 bg-linear-to-br from-emerald-50 via-white to-amber-50 border-2 border-emerald-200 rounded-3xl shadow-2xl">
                    <div className="text-center space-y-6">
                      {/* Header */}
                      <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900">
                          {lang === "hi" ? "आप कौन हैं?" : "Who are you?"}
                        </h2>
                        <p className="text-lg text-gray-600">
                          {lang === "hi"
                            ? "सही विकल्प चुनें और तुरंत शुरू करें"
                            : "Choose your role to continue"}
                        </p>
                      </div>

                      {/* Role Cards */}
                      <div className="grid grid-cols-2 gap-6 pt-4">
                        {/* Farmer Card */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="group cursor-pointer"
                          onClick={() => {
                            // Route to farmer signup/login
                            window.location.href = "/farmer";
                          }}
                        >
                          <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-emerald-500 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-100 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                            <div className="relative z-10 flex flex-col items-center gap-4">
                              <div className="p-5 bg-emerald-100 rounded-2xl group-hover:bg-emerald-600 transition-all duration-300">
                                <Tractor className="w-14 h-14 text-emerald-600 group-hover:text-white transition-colors" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {lang === "hi" ? "किसान" : "Farmer"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {lang === "hi"
                                  ? "अपना माल बेचें"
                                  : "Sell your produce"}
                              </p>
                              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check className="w-8 h-8 text-emerald-600" />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Buyer / Trader Card */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="group cursor-pointer"
                          onClick={() => {
                            // Route to buyer/trader dashboard
                            window.location.href = "/buyer";
                          }}
                        >
                          <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-amber-500 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-br from-amber-100 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col items-center gap-4">
                              <div className="p-5 bg-amber-100 rounded-2xl group-hover:bg-amber-600 transition-all duration-300">
                                <Store className="w-14 h-14 text-amber-600 group-hover:text-white transition-colors" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">
                                {lang === "hi" ? "व्यापारी" : "Buyer"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {lang === "hi" ? "सीधे खरीदें" : "Buy directly"}
                              </p>
                              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check className="w-8 h-8 text-amber-600" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Trust Footer */}
                      <p className="text-sm text-gray-500 pt-6 flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        {lang === "hi"
                          ? "28 लाख+ किसान और व्यापारी पहले से जुड़े हैं"
                          : "Trusted by 2.8M+ farmers & buyers"}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Trust Line */}
              <p className="text-lg text-gray-600 font-medium">{t.trust}</p>
            </motion.div>

            {/* Right Side - Feature Cards */}
            <div className="space-y-8">
              {t.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-500"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-emerald-100 rounded-2xl group-hover:bg-emerald-600 transition-all duration-300">
                      <feature.icon className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

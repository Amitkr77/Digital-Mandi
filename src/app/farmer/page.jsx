"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Loader2, Plus, Wheat, Truck, IndianRupee, TrendingUp, 
  Phone, MessageCircle, Shield, AlertCircle, CheckCircle2,
  CloudRain, Sun, Thermometer, Calendar, Bell, Wallet,
  Package, History, MapPin, ChevronRight, Star, Zap,
  Droplets, Wind, AlertTriangle, BarChart3, Users
} from "lucide-react";

export default function FarmerDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [data, setData] = useState({
    farmerName: "राम सिंह",
    phone: "98765 43210",
    village: "कन्नौज, उत्तर प्रदेश",
    aadhaarVerified: true,
    totalEarnings: 1245000,
    thisMonthEarnings: 185000,
    walletBalance: 28400,
    activeListings: 5,
    pendingPayments: 2,
    todaysPickup: 3,
    creditScore: 82,
    rating: 4.8,
    totalSales: 48,
    weather: { temp: 28, condition: "धूप", rainChance: 10, icon: <Sun /> },
    notifications: 7,
    loans: [
      { id: 1, amount: 50000, emi: 5200, dueIn: 12, status: "चालू" },
      { id: 2, amount: 30000, emi: 0, dueIn: 0, status: "चुकता", paid: true }
    ],
    listings: [
      { id: 1, crop: "गेहूं", qty: 450, price: 2150, status: "बोली चल रही है", bids: 12, highestBid: 2280 },
      { id: 2, crop: "चावल", qty: 800, price: 4200, status: "पिकअप आज", bids: 8, buyer: "श्री ट्रेडर्स" },
      { id: 3, crop: "आलू", qty: 1200, price: 1800, status: "बिका", paid: true },
    ],
    recentTransactions: [
      { id: 1, desc: "आलू बिका - श्री ट्रेडर्स", amount: 216000, date: "2 दिन पहले", type: "credit" },
      { id: 2, desc: "ट्रांसपोर्ट सब्सिडी", amount: 5000, date: "5 दिन पहले", type: "credit" },
      { id: 3, desc: "बीज लोन EMI", amount: -5200, date: "आज", type: "debit" },
    ],
    mandiRates: [
      { crop: "गेहूं", rate: "₹2,275", change: "+75" },
      { crop: "चावल", rate: "₹4,350", change: "+150" },
      { crop: "आलू", rate: "₹1,850", change: "-50" },
      { crop: "सरसों", rate: "₹6,800", change: "+200" },
    ]
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">डैशबोर्ड लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-linear-to-b from-emerald-50 via-white to-gray-50">

        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-green-700 text-white pt-16 pb-10 px-6 rounded-b-3xl shadow-2xl relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-24 w-24 ring-4 ring-white/40">
                  <AvatarFallback className="bg-emerald-400 text-4xl font-bold">रासिं</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-black">नमस्ते, {data.farmerName} जी 🙏</h1>
                  <p className="text-emerald-100 text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> {data.village}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-white/20">
                      <Star className="w-4 h-4 mr-1" /> {data.rating} ({data.totalSales} बिक्री)
                    </Badge>
                    {data.aadhaarVerified && (
                      <Badge className="bg-green-500">आधार सत्यापित ✓</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 mb-3">
                  <Shield className="w-5 h-5 mr-2" />
                  पूरी तरह सुरक्षित
                </Badge>
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mt-3">
                  <Bell className="w-8 h-8 mx-auto" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {data.notifications}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">

          {/* Wallet + Weather Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Wallet */}
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className="bg-linear-to-br from-purple-600 to-indigo-700 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-purple-100">वॉलेट बैलेंस</p>
                    <p className="text-4xl font-black mt-2">₹{data.walletBalance.toLocaleString("en-IN")}</p>
                    <Button size="sm" className="mt-4 bg-white text-purple-700 hover:bg-purple-50">
                      <Wallet className="w-4 h-4 mr-2" /> निकालें
                    </Button>
                  </div>
                  <Wallet className="w-16 h-16 opacity-40" />
                </div>
              </div>
            </Card>

            {/* Weather */}
            <Card className="shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">आज का मौसम</p>
                    <p className="text-5xl font-bold">{data.weather.temp}°C</p>
                    <p className="text-xl font-semibold flex items-center gap-2 mt-2">
                      {data.weather.icon} {data.weather.condition}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Droplets className="w-4 h-4" /> बारिश की संभावना: {data.weather.rainChance}%
                    </p>
                  </div>
                  <div className="text-6xl">{data.weather.icon}</div>
                </div>
              </CardContent>
            </Card>

            {/* Mandi Rates */}
            <Card className="shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> आज के मंडी भाव
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.mandiRates.map((item, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <span className="font-medium">{item.crop}</span>
                    <span className={`font-bold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.rate} <small>{item.change}</small>
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Earnings */}
          <Card className="mb-8 shadow-2xl border-0 overflow-hidden">
            <div className="bg-linear-to-r from-emerald-500 to-green-600 p-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-emerald-100 text-xl">कुल कमाई अब तक</p>
                  <p className="text-6xl font-black mt-3">₹{data.totalEarnings.toLocaleString("en-IN")}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-7 h-7" />
                      <span className="text-3xl font-bold">+₹{data.thisMonthEarnings.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="text-emerald-100 text-xl">इस महीने</span>
                  </div>
                </div>
                <IndianRupee className="w-32 h-32 opacity-30" />
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">सारांश</TabsTrigger>
              <TabsTrigger value="crops">फसलें</TabsTrigger>
              <TabsTrigger value="finance">वित्तीय</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Card className="text-center p-6 bg-white shadow-xl hover:shadow-2xl transition-all border-2 border-emerald-100">
                  <Wheat className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <p className="text-4xl font-black text-gray-900">{data.activeListings}</p>
                  <p className="text-gray-600 font-semibold">सक्रिय लिस्टिंग</p>
                </Card>
                <Card className="text-center p-6 bg-white shadow-xl hover:shadow-2xl transition-all border-2 border-amber-100">
                  <Truck className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <p className="text-4xl font-black text-gray-900">{data.todaysPickup}</p>
                  <p className="text-gray-600 font-semibold">आज पिकअप</p>
                  <Badge className="mt-2 bg-amber-500">तुरंत</Badge>
                </Card>
                <Card className="text-center p-6 bg-white shadow-xl hover:shadow-2xl transition-all border-2 border-blue-100">
                  <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-4xl font-black text-gray-900">{data.pendingPayments}</p>
                  <p className="text-gray-600 font-semibold">पेंडिंग पेमेंट</p>
                </Card>
                <Card className="text-center p-6 bg-white shadow-xl hover:shadow-2xl transition-all border-2 border-green-100">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-4xl font-black text-gray-900">{data.creditScore}%</p>
                  <p className="text-gray-600 font-semibold">क्रेडिट स्कोर</p>
                  <Progress value={data.creditScore} className="mt-3 h-4" />
                </Card>
              </div>

              {/* Active Crops */}
              <Card className="mb-8 shadow-2xl">
                <CardHeader className="bg-emerald-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Wheat className="w-8 h-8 text-emerald-600" />
                      आपकी मौजूदा फसलें
                    </CardTitle>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-5 h-5 mr-2" /> नई फसल जोड़ें
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {data.listings.map((item) => (
                    <div key={item.id} className="p-6 border-b last:border-b-0 hover:bg-emerald-50 transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">{item.crop}</h3>
                          <p className="text-lg text-gray-600 mt-1">
                            {item.qty} किलो • आधार मूल्य: ₹{item.price}/किलो
                            {item.highestBid && <span className="text-emerald-600 font-bold"> → ₹{item.highestBid} (उच्चतम बोली)</span>}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{item.bids} बोलियाँ • {item.buyer && `खरीदार: ${item.buyer}`}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="default"
                            className={`text-lg px-6 py-3 font-bold ${
                              item.status === "पिकअप आज" ? "bg-amber-500" : 
                              item.status === "बोली चल रही है" ? "bg-blue-600" :
                              item.status === "बिका" ? "bg-green-600" : "bg-gray-600"
                            }`}
                          >
                            {item.status === "पिकअप आज" && <Truck className="w-5 h-5 inline mr-2" />}
                            {item.status}
                          </Badge>
                          {item.paid && <CheckCircle2 className="w-8 h-8 text-emerald-600 mt-3 mx-auto" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>हाल की लेन-देन</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center py-5 border-b last:border-b-0">
                        <div>
                          <p className="font-bold text-lg">{tx.desc}</p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                        <span className={`text-3xl font-black ${tx.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                          {tx.type === "credit" ? "+" : "-"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle>लोन की स्थिति</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.loans.map((loan) => (
                      <div key={loan.id} className="mb-6 p-4 rounded-xl border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-xl">लोन #{loan.id}</span>
                          <Badge className={loan.paid ? "bg-green-500" : "bg-orange-500"}>
                            {loan.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-lg">
                          <p>मूल राशि: <strong>₹{loan.amount.toLocaleString()}</strong></p>
                          {loan.emi > 0 && <p>मासिक EMI: <strong className="text-red-600">₹{loan.emi}</strong></p>}
                          {loan.dueIn > 0 && <p className="text-orange-600 font-bold">अगली किस्त: {loan.dueIn} दिन में</p>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Support CTA */}
          <div className="my-16 text-center">
            <Alert className="max-w-2xl mx-auto mb-8 border-emerald-200 bg-emerald-50">
              <Zap className="h-6 w-6 text-emerald-600" />
              <AlertTitle className="text-xl">24×7 सहायता उपलब्ध है!</AlertTitle>
              <AlertDescription className="text-lg mt-2">
                कोई समस्या? तुरंत बात करें — हमारा टीम हिंदी में मदद करेगा
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-xl px-12 py-8 rounded-2xl shadow-2xl bg-emerald-600 hover:bg-emerald-700">
                <Phone className="w-8 h-8 mr-3" />
                अभी कॉल करें
              </Button>
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 rounded-2xl border-2">
                <MessageCircle className="w-8 h-8 mr-3" />
                चैट करें
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
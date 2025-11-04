import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingBag, MapPin, Phone, Mail } from "lucide-react";

const farmer = {
  id: 1,
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh@example.com",
  village: "Kheda, Gujarat",
  produce: ["Rice", "Wheat", "Pulses"],
  totalSales: "₹1,24,500",
  outstanding: "₹8,200",
  recentSales: [
    { id: "#SALE8921", date: "Nov 3", product: "Basmati Rice", qty: "200kg", amount: "₹24,000" },
    { id: "#SALE8910", date: "Nov 1", product: "Wheat", qty: "300kg", amount: "₹18,000" },
  ]
};

export default function FarmerDetail({ params }) {
  if (!farmer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{farmer.name}</h1>
        <Button>Send Message</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Phone className="h-4 w-4" />
            <CardTitle className="text-sm">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{farmer.phone}</p>
            <p className="text-sm text-muted-foreground">{farmer.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <MapPin className="h-4 w-4" />
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{farmer.village}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Package className="h-4 w-4" />
            <CardTitle className="text-sm">Produce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {farmer.produce.map(p => <span key={p} className="px-2 py-1 text-xs bg-muted rounded-full">{p}</span>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmer.recentSales.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{s.id}</p>
                      <p className="text-muted-foreground">{s.date} • {s.product} • {s.qty}</p>
                    </div>
                    <p className="font-semibold">{s.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Credit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">₹{farmer.outstanding}</p>
              <Button className="mt-4" variant="outline">Settle Now</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
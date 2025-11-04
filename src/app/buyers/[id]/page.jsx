import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, MapPin, ShoppingBag, CreditCard, Clock } from "lucide-react";

const buyer = {
  id: 1,
  name: "Metro Mart",
  contact: "Vikram Singh",
  phone: "+91 98765 11111",
  location: "Gandhinagar, Gujarat",
  totalPurchases: "₹1,68,000",
  outstanding: "₹12,500",
  recentPurchases: [
    { id: "#SALE8921", date: "Nov 3", product: "Basmati Rice", qty: "400kg", amount: "₹48,000" },
    { id: "#SALE8915", date: "Nov 1", product: "Tomatoes", qty: "150kg", amount: "₹22,500" },
  ],
};

export default function BuyerDetail({ params }) {
  if (!buyer) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{buyer.name}</h1>
        <Button>Send Invoice</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Phone className="h-4 w-4" />
            <CardTitle className="text-sm">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{buyer.contact}</p>
            <p className="text-sm text-muted-foreground">{buyer.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MapPin className="h-4 w-4" />
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{buyer.location}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <ShoppingBag className="h-4 w-4" />
            <CardTitle className="text-sm">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{buyer.totalPurchases}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchases">
        <TabsList>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {buyer.recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{p.id}</p>
                      <p className="text-muted-foreground">
                        {p.date} • {p.product} • {p.qty}
                      </p>
                    </div>
                    <p className="font-semibold">{p.amount}</p>
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
              <p className="text-2xl font-bold text-red-600">₹{buyer.outstanding}</p>
              <Button className="mt-4" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Settle Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
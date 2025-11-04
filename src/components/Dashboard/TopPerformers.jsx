import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const products = [
  { name: "Basmati Rice", sales: "₹48,200" },
  { name: "Tomatoes", sales: "₹32,800" },
  { name: "Onions", sales: "₹28,500" },
  { name: "Potatoes", sales: "₹22,100" },
];

const farmers = [
  { name: "Rajesh Kumar", sales: "₹1,24,500" },
  { name: "Sita Devi", sales: "₹98,300" },
  { name: "Mohan Lal", sales: "₹82,100" },
];

const buyers = [
  { name: "Metro Mart", sales: "₹1,68,000" },
  { name: "Fresh Mart", sales: "₹1,42,300" },
  { name: "Green Grocer", sales: "₹98,700" },
];

const TopPerformers = () => {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="farmers">Farmers</TabsTrigger>
        <TabsTrigger value="buyers">Buyers</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-3 mt-4">
        {products.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{i + 1}</Badge>
              <span className="font-medium">{p.name}</span>
            </div>
            <span className="font-semibold text-muted-foreground">{p.sales}</span>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="farmers" className="space-y-3 mt-4">
        {farmers.map((f, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{i + 1}</Badge>
              <span>{f.name}</span>
            </div>
            <span className="font-semibold text-muted-foreground">{f.sales}</span>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="buyers" className="space-y-3 mt-4">
        {buyers.map((b, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{i + 1}</Badge>
              <span>{b.name}</span>
            </div>
            <span className="font-semibold text-muted-foreground">{b.sales}</span>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default TopPerformers;
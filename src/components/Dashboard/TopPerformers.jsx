import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Medal,
  Trophy,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  { name: "Basmati Rice", sales: 48200, icon: "🌾" },
  { name: "Tomatoes", sales: 32800, icon: "🍅" },
  { name: "Onions", sales: 28500, icon: "🧅" },
  // { name: "Potatoes", sales: 22100, icon: "🥔" },
];

const farmers = [
  { name: "Rajesh Kumar", sales: 124500, avatar: "RK" },
  { name: "Sita Devi", sales: 98300, avatar: "SD" },
  { name: "Mohan Lal", sales: 82100, avatar: "ML" },
];

const buyers = [
  { name: "Metro Mart", sales: 168000, icon: "🏪" },
  { name: "Fresh Mart", sales: 142300, icon: "🛒" },
  { name: "Green Grocer", sales: 98700, icon: "🥬" },
];

const getMedal = (index) => {
  switch (index) {
    case 0:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 1:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 2:
      return <Award className="w-5 h-5 text-orange-600" />;
    default:
      return <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">{index + 1}</Badge>;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const TopPerformers = () => {
  const getMaxSales = (data) => Math.max(...data.map(d => d.sales));

  const renderList = (items, type) => {
    const maxSales = getMaxSales(items);
    
    return items.map((item, i) => {
      const percentage = (item.sales / maxSales) * 100;

      return (
        <div
          key={i}
          className={cn(
            "group relative overflow-hidden rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
            i === 0 && "border-yellow-200 dark:border-yellow-900/50",
            i === 1 && "border-gray-200 dark:border-gray-700",
            i === 2 && "border-orange-200 dark:border-orange-900/50"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Rank Badge / Medal */}
              <div className="shrink-0">
                {getMedal(i)}
              </div>

              {/* Avatar / Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                {type === "products" && <span className="text-lg">{item.icon}</span>}
                {type === "farmers" && (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {item.avatar}
                  </div>
                )}
                {type === "buyers" && <span className="text-lg">{item.icon}</span>}
              </div>

              {/* Name */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {type === "products" && "Product"}
                  {type === "farmers" && "Farmer"}
                  {type === "buyers" && "Buyer"}
                </p>
              </div>
            </div>

            {/* Sales & Progress */}
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="font-bold text-lg whitespace-nowrap">
                {formatCurrency(item.sales)}
              </span>
              <div className="w-20">
                <Progress value={percentage} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </div>
      );
    });
  };

  return (
    <Card className="w-full shadow-lg">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Top Performers</h2>
          <Trophy className="w-6 h-6 text-primary" />
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex flex-col gap-1 py-3"
            >
              <Package className="w-4 h-4" />
              <span className="text-xs font-medium">Products</span>
            </TabsTrigger>
            <TabsTrigger 
              value="farmers" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex flex-col gap-1 py-3"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Farmers</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buyers" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm flex flex-col gap-1 py-3"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-medium">Buyers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-3 mt-0 animate-in fade-in-0 duration-300">
            {renderList(products, "products")}
          </TabsContent>

          <TabsContent value="farmers" className="space-y-3 mt-0 animate-in fade-in-0 duration-300">
            {renderList(farmers, "farmers")}
          </TabsContent>

          <TabsContent value="buyers" className="space-y-3 mt-0 animate-in fade-in-0 duration-300">
            {renderList(buyers, "buyers")}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default TopPerformers;
"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Package,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import RecordSaleModal from "@/components/modals/RecordSaleModal";

const sales = [
  {
    id: "#SALE8921",
    date: "Nov 3, 2025",
    farmer: "Rajesh Kumar",
    buyer: "Metro Mart",
    product: "Basmati Rice",
    qty: "200kg",
    amount: "₹24,000",
    payment: "Credit",
    status: "Pending",
  },
  {
    id: "#SALE8920",
    date: "Nov 3, 2025",
    farmer: "Sita Devi",
    buyer: "Fresh Mart",
    product: "Tomatoes",
    qty: "150kg",
    amount: "₹22,500",
    payment: "Cash",
    status: "Completed",
  },
  {
    id: "#SALE8919",
    date: "Nov 2, 2025",
    farmer: "Vikram Singh",
    buyer: "City Grain Co",
    product: "Wheat",
    qty: "500kg",
    amount: "₹35,000",
    payment: "Cash",
    status: "Completed",
  },
];

export default function SalesPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Filter logic
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.id.toLowerCase().includes(search.toLowerCase()) ||
        sale.farmer.toLowerCase().includes(search.toLowerCase()) ||
        sale.buyer.toLowerCase().includes(search.toLowerCase()) ||
        sale.product.toLowerCase().includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === "all" || sale.payment === paymentFilter;

      const matchesStatus =
        statusFilter === "all" || sale.status === statusFilter;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [search, paymentFilter, statusFilter]);

  const columns = [
    {
      header: "Sale ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono font-medium text-primary">{row.id}</span>
      ),
    },
    { header: "Date", accessor: "date" },
    { header: "Farmer", accessor: "farmer" },
    { header: "Buyer", accessor: "buyer" },
    { header: "Product", accessor: "product" },
    { header: "Qty", accessor: "qty" },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-medium text-green-700">{row.amount}</span>
      ),
    },
    {
      header: "Payment",
      accessor: "payment",
      render: (row) => (
        <Badge
          variant={row.payment === "Cash" ? "default" : "secondary"}
          className="text-xs"
        >
          {row.payment === "Cash" ? (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          ) : (
            <Clock className="h-3 w-3 mr-1" />
          )}
          {row.payment}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <Badge
          variant={row.status === "Completed" ? "default" : "secondary"}
          className={`text-xs ${
            row.status === "Completed"
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {row.status === "Completed" ? (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          ) : (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record and track all market transactions
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Record Sale
          </Button> */}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, farmer, buyer, product..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit">Credit</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSales.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No sales found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search || paymentFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Start recording your first sale"}
            </p>
            {!(search || paymentFilter !== "all" || statusFilter !== "all") && (
              <Button className="mt-4" onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Record Sale
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden lg:block">
            <DataTable data={filteredSales} columns={columns} />
          </div>

          {/* Mobile: Cards */}
          <div className="block lg:hidden space-y-4">
            {filteredSales.map((sale) => (
              <Card key={sale.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-mono text-primary">
                        {sale.id}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {sale.date}
                      </p>
                    </div>
                    <Badge
                      variant={sale.status === "Completed" ? "default" : "secondary"}
                      className={`text-xs ${
                        sale.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Farmer</p>
                      <p className="font-medium">{sale.farmer}</p>  
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer</p>
                      <p className="font-medium">{sale.buyer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {sale.product} • <strong>{sale.qty}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 font-medium text-green-700">
                      <IndianRupee className="h-4 w-4" />
                      {sale.amount}
                    </div>
                    <Badge
                      variant={sale.payment === "Cash" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {sale.payment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <RecordSaleModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
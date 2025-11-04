"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Phone, MapPin, Package, IndianRupee, Edit,Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/common/DataTable";
import AddFarmerModal from "@/components/modals/AddFarmerModal";
import EditFarmerModal from "@/components/modals/EditFarmerModal";

const farmers = [
  { id: 1, name: "Rajesh Kumar", phone: "+91 98765 43210", village: "Kheda", produce: "Rice, Wheat", sales: "₹1,24,500", status: "Active" },
  { id: 2, name: "Sita Devi", phone: "+91 87654 32109", village: "Nadiad", produce: "Tomatoes, Onions", sales: "₹98,300", status: "Active" },
  { id: 3, name: "Vikram Singh", phone: "+91 76543 21098", village: "Anand", produce: "Pulses, Maize", sales: "₹1,56,200", status: "Active" },
  { id: 4, name: "Meera Patel", phone: "+91 65432 10987", village: "Borsad", produce: "Cotton", sales: "₹2,10,000", status: "Inactive" },
];

export default function FarmersPage() {
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Filtered & Searched Data
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.village.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <a href={`/farmers/${row.id}`} className="font-medium text-primary hover:underline">
          {row.name}
        </a>
      ),
    },
    { header: "Phone", accessor: "phone" },
    { header: "Village", accessor: "village" },
    { header: "Produce", accessor: "produce" },
    { header: "Total Sales", accessor: "sales" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "default" : "secondary"} className="text-xs">
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setSelected(row);
            setOpenEdit(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Farmers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track all registered farmers</p>
        </div>
        <Button onClick={() => setOpenAdd(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Farmer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, village..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFarmers.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No farmers found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search ? "Try adjusting your search query" : "Start by adding your first farmer"}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => setOpenAdd(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Farmer
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden lg:block">
            <DataTable data={filteredFarmers} columns={columns} />
          </div>

          {/* Mobile: Cards */}
          <div className="block lg:hidden space-y-4">
            {filteredFarmers.map((farmer) => (
              <Card
                key={farmer.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => {
                  setSelected(farmer);
                  setOpenEdit(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <a
                          href={`/farmers/${farmer.id}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {farmer.name}
                        </a>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {farmer.village}
                      </p>
                    </div>
                    <Badge variant={farmer.status === "Active" ? "default" : "secondary"}>
                      {farmer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {farmer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {farmer.produce}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <IndianRupee className="h-4 w-4" />
                    {farmer.sales}
                  </div>
                  <div className="pt-2 border-t flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(farmer);
                        setOpenEdit(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <AddFarmerModal open={openAdd} onOpenChange={setOpenAdd} />
      <EditFarmerModal open={openEdit} onOpenChange={setOpenEdit} farmer={selected} />
    </div>
  );
}
"use client";

import { useState } from "react";
import { Plus, Search, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/common/DataTable";
import AddBuyerModal from "@/components/modals/AddBuyerModal";
import EditBuyerModal from "@/components/modals/EditBuyerModal";

const buyers = [
  {
    id: 1,
    name: "Metro Mart",
    contact: "Vikram Singh",
    phone: "+91 98765 11111",
    location: "Gandhinagar",
    totalPurchases: "₹1,68,000",
    status: "Active",
  },
  {
    id: 2,
    name: "Fresh Mart",
    contact: "Priya Sharma",
    phone: "+91 87654 22222",
    location: "Ahmedabad",
    totalPurchases: "₹1,42,300",
    status: "Active",
  },
  {
    id: 3,
    name: "Green Grocer",
    contact: "Amit Desai",
    phone: "+91 76543 33333",
    location: "Surat",
    totalPurchases: "₹98,700",
    status: "Inactive",
  },
];

export default function BuyersPage() {
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      header: "Business Name",
      accessor: "name",
      render: (row) => (
        <a href={`/buyers/${row.id}`} className="text-primary hover:underline font-medium">
          {row.name}
        </a>
      ),
    },
    { header: "Contact", accessor: "contact" },
    {
      header: "Phone",
      accessor: "phone",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.location}</span>
        </div>
      ),
    },
    { header: "Total Purchases", accessor: "totalPurchases" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSelected(row);
            setOpenEdit(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const filtered = buyers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Buyers</h1>
          <p className="text-muted-foreground">Manage buyers and track their purchases.</p>
        </div>
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Buyer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search buyers..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable data={filtered} columns={columns} />

      <AddBuyerModal open={openAdd} onOpenChange={setOpenAdd} />
      <EditBuyerModal open={openEdit} onOpenChange={setOpenEdit} buyer={selected} />
    </div>
  );
}
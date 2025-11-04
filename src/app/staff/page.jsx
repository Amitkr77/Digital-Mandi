"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import AddStaffModal from "@/components/modals/AddStaffModal";

const staff = [
  { id: 1, name: "Amit Patel", role: "Manager", phone: "+91 98765 11111", status: "Active" },
  { id: 2, name: "Neha Sharma", role: "Accountant", phone: "+91 87654 22222", status: "Active" },
];

export default function StaffPage() {
  const [open, setOpen] = useState(false);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Phone", accessor: "phone" },
    { header: "Status", accessor: "status", render: (row) => <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>
      <DataTable data={staff} columns={columns} />
      <AddStaffModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
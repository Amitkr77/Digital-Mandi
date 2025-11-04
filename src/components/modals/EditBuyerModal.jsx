"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function EditBuyerModal({ open, onOpenChange, buyer }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (buyer && open) {
      setFormData({
        name: buyer.name || "",
        contact: buyer.contact || "",
        phone: buyer.phone || "",
        location: buyer.location || "",
      });
    }
  }, [buyer, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Updated buyer:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Buyer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Business Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input name="contact" value={formData.contact} onChange={handleChange} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Location</Label>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
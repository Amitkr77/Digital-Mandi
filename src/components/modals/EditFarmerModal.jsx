"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function EditFarmerModal({ open, onOpenChange, farmer }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    produce: "",
  });

  // Pre-fill form when modal opens or farmer changes
  useEffect(() => {
    if (farmer && open) {
      setFormData({
        name: farmer.name || "",
        phone: farmer.phone || "",
        village: farmer.village || "",
        produce: Array.isArray(farmer.produce) ? farmer.produce.join(", ") : farmer.produce || "",
      });
    }
  }, [farmer, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In real app: API call to update farmer
    console.log("Saving farmer:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Farmer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rajesh Kumar"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="Kheda, Gujarat"
            />
          </div>

          <div>
            <Label htmlFor="produce">Produce (comma separated)</Label>
            <Textarea
              id="produce"
              name="produce"
              value={formData.produce}
              onChange={handleChange}
              placeholder="Rice, Wheat, Pulses"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
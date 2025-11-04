import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddBuyerModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Buyer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Business Name</Label>
            <Input placeholder="Metro Mart" />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input placeholder="Vikram Singh" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+91 98765 11111" />
          </div>
          <div>
            <Label>Address</Label>
            <Input placeholder="Gandhinagar, Gujarat" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Save Buyer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
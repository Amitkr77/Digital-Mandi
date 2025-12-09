import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddFarmerModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Farmer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder="Rajesh Kumar" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+91 98765 43210" />
          </div>
           <div>
            <Label>Email</Label>
            <Input placeholder="abc@gmail.com" />
          </div>
          <div>
            <Label>Village</Label>
            <Input placeholder="Kheda, Gujarat" />
          </div>
          <div>
            <Label>Produce (comma separated)</Label>
            <Textarea placeholder="Rice, Wheat, Pulses" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Save Farmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RecordSaleModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record New Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Farmer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select farmer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Rajesh Kumar</SelectItem>
                  <SelectItem value="2">Sita Devi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buyer</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select buyer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Metro Mart</SelectItem>
                  <SelectItem value="2">Fresh Mart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Product</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Basmati Rice</SelectItem>
                <SelectItem value="tomato">Tomatoes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity (kg)</Label>
              <Input type="number" placeholder="200" />
            </div>
            <div>
              <Label>Price per kg (₹)</Label>
              <Input type="number" placeholder="120" />
            </div>
          </div>

          <div>
            <Label>Payment Mode</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Cash / Credit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Record Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
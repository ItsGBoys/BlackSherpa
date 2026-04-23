"use client";

import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { createJobOrder } from "@/app/actions/job-actions";
import { toast } from "sonner";

export default function CreateJobDialog({ children, products }: { children: React.ReactNode, products: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    try {
      await createJobOrder(formData);
      setOpen(false);
      toast.success("Berhasil", { description: "Job Order baru telah dibuat" });
    } catch (error) {
      toast.error("Gagal", { description: "Gagal membuat Job Order" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Buat Job Order Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Produk</Label>
            <Select name="productId" required>
              <SelectTrigger className="bg-muted/50 border-border">
                <SelectValue placeholder="Pilih Produk" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qty">Jumlah Unit</Label>
              <Input id="qty" name="qty" type="number" placeholder="50" required className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioritas</Label>
              <Select name="priority" defaultValue="MEDIUM">
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Prioritas" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plannedStart">Mulai</Label>
              <Input id="plannedStart" name="plannedStart" type="date" required className="bg-muted/50 border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedEnd">Selesai</Label>
              <Input id="plannedEnd" name="plannedEnd" type="date" required className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold">
              {loading ? "Memproses..." : "Buat Job Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

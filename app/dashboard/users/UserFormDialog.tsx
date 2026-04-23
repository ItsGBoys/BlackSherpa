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
import { createUser } from "@/app/actions/user-actions";
import { toast } from "sonner";

export default function UserFormDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    try {
      await createUser(formData);
      setOpen(false);
      toast.success("Berhasil", { description: "User baru telah ditambahkan" });
    } catch (error) {
      toast.error("Gagal", { description: "Gagal menambahkan user" });
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
          <DialogTitle className="font-heading">Tambah User Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Andi Sherpa" required className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="andi@blacksherpa.id" required className="bg-muted/50 border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-muted/50 border-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="PIC_PRODUKSI">
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN_PRODUKSI">Admin Produksi</SelectItem>
                  <SelectItem value="PIC_POTONG_GUDANG">PIC Potong/Gudang</SelectItem>
                  <SelectItem value="PIC_PRODUKSI">PIC Produksi</SelectItem>
                  <SelectItem value="PIC_QC">PIC QC</SelectItem>
                  <SelectItem value="PIC_SEAL">PIC Seal</SelectItem>
                  <SelectItem value="PIC_PENGIRIMAN">PIC Pengiriman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="division">Divisi</Label>
              <Input id="division" name="division" placeholder="Produksi" className="bg-muted/50 border-border" />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold">
              {loading ? "Menyimpan..." : "Simpan User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

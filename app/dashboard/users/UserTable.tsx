"use client";

import { motion } from "framer-motion";
import { Shield, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { deleteUser } from "@/app/actions/user-actions";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN_PRODUKSI: "Admin Produksi",
  PIC_POTONG_GUDANG: "PIC Potong",
  PIC_PRODUKSI: "Produksi",
  PIC_QC: "Quality Control",
  PIC_SEAL: "Seal & Packing",
  PIC_PENGIRIMAN: "Pengiriman",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-primary text-primary-foreground",
  ADMIN_PRODUKSI: "bg-secondary text-secondary-foreground",
  PIC_POTONG_GUDANG: "bg-blue-600 text-foreground",
  PIC_PRODUKSI: "bg-emerald-600 text-foreground",
  PIC_QC: "bg-violet-600 text-foreground",
  PIC_SEAL: "bg-amber-600 text-foreground",
  PIC_PENGIRIMAN: "bg-cyan-600 text-foreground",
};

export default function UserTable({ users }: { users: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        await deleteUser(id);
        toast.success("Berhasil", { description: "User telah dihapus" });
      } catch (error) {
        toast.error("Gagal", { description: "Terjadi kesalahan" });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau email..." 
            className="pl-10 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-border">
          <Filter className="mr-2 h-4 w-4" /> Filter Role
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">User</th>
              <th className="text-left text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Role Access</th>
              <th className="text-left text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Status</th>
              <th className="text-right text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-heading font-bold border border-white/5 shadow-inner">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{u.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Badge className={`text-[10px] font-bold uppercase tracking-tight py-0.5 px-2 ${ROLE_COLORS[u.role]}`}>
                    <Shield size={10} className="mr-1.5" />{ROLE_LABELS[u.role]}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Aktif
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(u.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

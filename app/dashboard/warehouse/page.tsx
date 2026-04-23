import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AlertTriangle, Package, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ClientMotionDiv from "@/components/ClientMotionDiv";
import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";

export default async function WarehousePage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_POTONG_GUDANG"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const materials = await prisma.material.findMany({
    orderBy: { name: "asc" },
  });
  const jobs = await getJobsByPhase("PENGAMBILAN_BAHAN");

  const lowStockItems = materials.filter((m) => m.stock <= m.minStock);

  return (
    <div className="space-y-6">
      <DivisionPage
        phase="PENGAMBILAN_BAHAN"
        title="Divisi Gudang / Pengambilan Bahan"
        icon={<Database className="h-6 w-6 text-primary" />}
        jobs={jobs}
      />

      <ClientMotionDiv>
        <div className="flex items-center gap-3 mb-1">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Gudang & Stok Bahan</h1>
        </div>
        <p className="text-sm text-muted-foreground">Monitor stok bahan baku dan alert low stock</p>
      </ClientMotionDiv>

      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-secondary" />
            <span className="text-sm font-heading font-semibold text-secondary">Low Stock Alert</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((m) => (
              <Badge key={m.id} variant="outline" className="border-secondary/40 text-secondary">
                {m.name} — sisa {m.stock} {m.unit}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Bahan Baku</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Stok Saat Ini</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Min. Stok</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Satuan</th>
              <th className="text-right text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Harga Est.</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-4 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-4 font-medium text-sm">{m.name}</td>
                <td className="px-4 py-4 text-center font-mono text-sm">{m.stock}</td>
                <td className="px-4 py-4 text-center font-mono text-sm text-muted-foreground">{m.minStock}</td>
                <td className="px-4 py-4 text-center text-xs uppercase text-muted-foreground">{m.unit}</td>
                <td className="px-4 py-4 text-right font-mono text-sm">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(m.pricePerUnit)}
                </td>
                <td className="px-4 py-4 text-center">
                  {m.stock <= m.minStock ? (
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold">Low Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/30">Optimal</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

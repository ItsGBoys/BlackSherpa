import { prisma } from "@/lib/prisma";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientMotionDiv from "@/components/ClientMotionDiv";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { bom: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ClientMotionDiv>
          <div className="flex items-center gap-3 mb-1">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Master Produk</h1>
          </div>
          <p className="text-sm text-muted-foreground">Katalog produk dan Bill of Materials (BOM)</p>
        </ClientMotionDiv>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="p-6 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
            <h3 className="font-heading font-bold text-lg mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">{p.sku}</p>
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase">BOM Summary</p>
              {p.bom.slice(0, 3).map((b: any) => (
                <div key={b.id} className="flex justify-between text-xs">
                  <span>Material ID: {b.materialId.slice(-4)}</span>
                  <span className="font-mono">{b.qtyPerUnit} {b.unit}</span>
                </div>
              ))}
              {p.bom.length > 3 && <p className="text-[10px] text-muted-foreground italic">+ {p.bom.length - 3} material lainnya</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

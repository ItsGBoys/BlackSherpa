import { motion } from "framer-motion";
import { MOCK_MATERIALS } from "@/data/mockData";
import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const WarehousePage = () => {
  const lowStockItems = MOCK_MATERIALS.filter((m) => m.stock <= m.minStock);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Gudang & Stok Bahan</h1>
        </div>
        <p className="text-sm text-muted-foreground">Monitor stok bahan baku dan alert low stock</p>
      </motion.div>

      {lowStockItems.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
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
        </motion.div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Bahan Baku</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Stok</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Min. Stok</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Satuan</th>
              <th className="text-right text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Harga/Unit</th>
              <th className="text-center text-xs font-heading font-semibold text-muted-foreground px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MATERIALS.map((m, i) => (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                <td className="px-4 py-3 text-sm text-center font-mono">{m.stock}</td>
                <td className="px-4 py-3 text-sm text-center font-mono text-muted-foreground">{m.minStock}</td>
                <td className="px-4 py-3 text-sm text-center text-muted-foreground">{m.unit}</td>
                <td className="px-4 py-3 text-sm text-right font-mono">Rp {m.pricePerUnit.toLocaleString("id-ID")}</td>
                <td className="px-4 py-3 text-center">
                  {m.stock <= m.minStock ? (
                    <Badge variant="destructive" className="text-[10px]">Low Stock</Badge>
                  ) : m.stock <= m.minStock * 1.5 ? (
                    <Badge variant="outline" className="text-[10px] border-secondary/40 text-secondary">Hampir Habis</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">Aman</Badge>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehousePage;

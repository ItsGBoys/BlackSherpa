import { motion } from "framer-motion";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { Package, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ProductsPage = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Master Produk & BOM</h1>
        </div>
        <p className="text-sm text-muted-foreground">{MOCK_PRODUCTS.length} produk terdaftar</p>
      </motion.div>

      <div className="grid gap-4">
        {MOCK_PRODUCTS.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors"
          >
            <button onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)} className="w-full text-left p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-semibold">{product.name}</h3>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{product.category}</Badge>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers size={14} />
                  <span className="text-xs">{product.bom.length} material</span>
                </div>
              </div>
            </button>

            {expandedProduct === product.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border p-5 space-y-4">
                <div>
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2">BILL OF MATERIALS (per unit)</p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    {product.bom.map((b, j) => (
                      <div key={j} className={`flex items-center justify-between px-4 py-2 text-sm ${j > 0 ? "border-t border-border/50" : ""}`}>
                        <span>{b.materialName}</span>
                        <span className="font-mono text-muted-foreground">{b.qtyPerUnit} {b.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2">ROUTING PROSES</p>
                  <div className="flex gap-2">
                    {product.routing.map((r, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px]">{r}</Badge>
                        {j < product.routing.length - 1 && <span className="text-muted-foreground">→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;

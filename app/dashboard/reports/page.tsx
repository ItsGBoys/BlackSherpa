import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientMotionDiv from "@/components/ClientMotionDiv";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ClientMotionDiv>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Laporan Produksi</h1>
          </div>
          <p className="text-sm text-muted-foreground">Analitik efisiensi dan rekapitulasi data</p>
        </ClientMotionDiv>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-bold">
          <Download className="mr-2 h-4 w-4" /> Download CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-heading font-bold mb-4">Efisiensi Bahan Baku</h3>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center italic text-muted-foreground">
            Chart visualization placeholder
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-heading font-bold mb-4">Output Produksi Mingguan</h3>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center italic text-muted-foreground">
            Chart visualization placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

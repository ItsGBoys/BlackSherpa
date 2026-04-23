import { Calendar } from "lucide-react";
import ClientMotionDiv from "@/components/ClientMotionDiv";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <ClientMotionDiv>
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Penjadwalan Produksi</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gantt Chart & Kalender Operasional</p>
      </ClientMotionDiv>

      <div className="rounded-xl border border-border bg-card p-20 flex flex-col items-center justify-center text-center">
        <Calendar size={48} className="text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-heading font-bold text-muted-foreground">Coming Soon</h3>
        <p className="text-sm text-muted-foreground/60 max-w-xs mt-1">
          Fitur Gantt Chart interaktif sedang dalam tahap integrasi dengan database Supabase Realtime.
        </p>
      </div>
    </div>
  );
}

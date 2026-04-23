"use client";

import { motion } from "framer-motion";

interface Job {
  id: string;
  productName: string;
  qty: number;
  progress: number;
  wipPhase?: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

const priorityColors = { HIGH: "text-secondary", MEDIUM: "text-primary", LOW: "text-muted-foreground" };
const priorityLabels = { HIGH: "Tinggi", MEDIUM: "Sedang", LOW: "Rendah" };

function macroPhase(wipPhase?: string | null) {
  if (!wipPhase || wipPhase === "PENGAMBILAN_BAHAN") return "Pengambilan Bahan Baku";
  if (wipPhase === "DIKIRIM") return "Selesai";
  return "Proses Bahan Baku";
}

export default function ProductionProgress({ jobs = [] }: { jobs?: any[] }) {
  // Use mock data if no jobs provided for dashboard visualization
  const displayJobs = jobs.length > 0 ? jobs.slice(0, 4) : [
    { id: "JO-001", productName: "Tenda Ultralight 2P", qty: 50, progress: 85, wipPhase: "QC", priority: "HIGH" },
    { id: "JO-002", productName: "Tarp Shelter 3x4", qty: 100, progress: 55, wipPhase: "PRODUKSI", priority: "MEDIUM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg">Progres Produksi Aktif</h3>
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {displayJobs.length} Job Order
        </span>
      </div>

      <div className="space-y-5">
        {displayJobs.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-muted-foreground font-mono">{job.id.slice(-8)}</span>
                <p className="text-sm font-medium">{job.productName}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${priorityColors[job.priority as keyof typeof priorityColors]}`}>
                  {priorityLabels[job.priority as keyof typeof priorityLabels]}
                </span>
                <p className="text-xs text-muted-foreground">{job.qty} unit · {macroPhase(job.wipPhase)}</p>
              </div>
            </div>

            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: job.progress >= 80
                    ? "linear-gradient(90deg, hsl(157 100% 50%), hsl(157 80% 70%))"
                    : job.progress >= 50
                    ? "linear-gradient(90deg, hsl(157 100% 50%), hsl(45 100% 50%))"
                    : "linear-gradient(90deg, hsl(22 100% 50%), hsl(45 100% 50%))"
                }}
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
              />
              {[10, 25, 55, 70, 85, 95, 100].map((marker) => (
                <div
                  key={marker}
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-muted-foreground/30"
                  style={{ left: `${marker}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">WIP {Math.round(job.progress)}%</span>
              <span className="text-[10px] text-muted-foreground">Target 100%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

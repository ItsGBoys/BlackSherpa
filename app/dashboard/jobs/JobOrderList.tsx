"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ClipboardList, ChevronDown, ChevronUp, Package, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cancelJobOrder, releaseJobOrder } from "@/app/actions/job-actions";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SCHEDULED: "bg-blue-600/20 text-blue-400",
  IN_PROGRESS: "bg-secondary/20 text-secondary",
  COMPLETED: "bg-primary/20 text-primary",
  CANCELLED: "bg-destructive/20 text-destructive",
};

const PHASE_LABELS: Record<string, string> = {
  PENGAMBILAN_BAHAN: "Bahan",
  POTONG: "Potong",
  PRODUKSI: "Produksi",
  QC: "QC",
  SEAL: "Seal",
  PACKING: "Packing",
  DIKIRIM: "Kirim",
};

function macroPhase(wipPhase?: string | null) {
  if (!wipPhase || wipPhase === "PENGAMBILAN_BAHAN") return "Pengambilan Bahan Baku";
  if (wipPhase === "DIKIRIM") return "Selesai";
  return "Proses Bahan Baku";
}

export default function JobOrderList({ initialJobs }: { initialJobs: any[] }) {
  const [jobs] = useState(initialJobs);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const router = useRouter();

  const onRelease = async (jobId: string) => {
    try {
      await releaseJobOrder(jobId);
      toast.success("Berhasil", { description: "Job order sudah direlease" });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal release job order";
      toast.error("Gagal", { description: message });
    }
  };

  const onCancel = async (jobId: string) => {
    try {
      await cancelJobOrder(jobId);
      toast.success("Berhasil", { description: "Job order dibatalkan" });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal membatalkan job order";
      toast.error("Gagal", { description: message });
    }
  };

  return (
    <div className="space-y-3">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors"
        >
          <button
            onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase">{job.id.slice(-8)}</span>
                  <Badge className={`text-[10px] ${statusColors[job.status]}`}>{job.status}</Badge>
                  <Badge variant={job.priority === "HIGH" ? "destructive" : "secondary"} className="text-[10px]">
                    {job.priority}
                  </Badge>
                </div>
                <h3 className="text-sm font-heading font-semibold mt-1">{job.productName}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><Package size={11} />{job.qty} unit</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />{new Date(job.plannedStart).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="text-lg font-heading font-bold text-primary">{Math.round(job.progress)}%</p>
                <p className="text-[10px] text-muted-foreground">{macroPhase(job.wipPhase)}</p>
              </div>
              {expandedJob === job.id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
            </div>
          </button>

          <AnimatePresence>
            {expandedJob === job.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border overflow-hidden"
              >
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border">
                      <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">Workflow Status</p>
                      <div className="flex gap-1">
                        {job.tasks.map((t: any) => (
                          <div 
                            key={t.id} 
                            className={`flex-1 h-1.5 rounded-full ${t.status === "DONE" ? "bg-primary" : t.status === "IN_PROGRESS" ? "bg-secondary animate-pulse" : "bg-muted"}`} 
                            title={PHASE_LABELS[t.phase] || t.phase}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/20 border border-border">
                      <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">Target Selesai</p>
                      <p className="text-sm font-bold">{new Date(job.plannedEnd).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/20 border border-border">
                      <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">Kontrol</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] font-bold"
                          disabled={job.status !== "DRAFT"}
                          onClick={() => onRelease(job.id)}
                        >
                          RELEASE
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-[10px] font-bold text-destructive"
                          disabled={job.status === "COMPLETED" || job.status === "CANCELLED"}
                          onClick={() => onCancel(job.id)}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

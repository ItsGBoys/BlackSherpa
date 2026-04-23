"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, RotateCcw, Camera, Box, ChevronRight, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TentIcon from "@/components/TentIcon";
import { toast } from "sonner";

interface DivisionPageProps {
  phase: string;
  title: string;
  icon: React.ReactNode;
  jobs: any[];
}

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={16} className="text-muted-foreground" />,
  IN_PROGRESS: <AlertTriangle size={16} className="text-secondary" />,
  DONE: <CheckCircle2 size={16} className="text-primary" />,
  REWORK: <RotateCcw size={16} className="text-destructive" />,
};

const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  IN_PROGRESS: "Dikerjakan",
  DONE: "Selesai",
  REWORK: "Rework",
};

const PHASE_LABELS: Record<string, string> = {
  BAHAN: "Pengambilan Bahan",
  POTONG: "Potong",
  PRODUKSI: "Produksi",
  QC: "Quality Control",
  SEAL: "Seal",
  SHIPPING: "Pengiriman",
};

export default function DivisionPage({ phase, title, icon, jobs: initialJobs }: DivisionPageProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [qcStatus, setQcStatus] = useState<"pass" | "fail">("pass");
  const [loading, setLoading] = useState(false);

  const handleAction = (job: any) => {
    setSelectedJob(job);
    setShowActionDialog(true);
  };

  const onConfirmUpdate = async () => {
    if (!selectedJob) return;
    setLoading(true);
    
    // Here we would call a server action to update the database
    // For now, let's simulate the success
    try {
      toast.success("Berhasil", { description: "Progress telah diperbarui" });
      setShowActionDialog(false);
      setNotes("");
    } catch (error) {
      toast.error("Gagal", { description: "Gagal memperbarui progress" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
            <h1 className="text-3xl font-heading font-bold">{title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Monitoring & update progress produksi divisi {title.toLowerCase()}</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-widest">Status Divisi</p>
          <p className="text-sm font-medium text-primary flex items-center gap-2 justify-end">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Operasional Aktif
          </p>
        </div>
      </motion.div>

      {jobs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <TentIcon size={40} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-heading font-bold text-muted-foreground">Belum ada tugas</h3>
          <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">
            Saat ini tidak ada Job Order yang perlu diproses di divisi ini.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, i) => {
            const task = job.tasks.find((t: any) => t.phase === phase)!;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-border bg-card p-6 ripple-effect overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  <TentIcon size={120} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                        {job.id}
                      </span>
                      <h3 className="text-lg font-heading font-bold mt-2 group-hover:text-primary transition-colors">
                        {job.productName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium flex items-center gap-1.5">
                          <Box size={14} className="text-muted-foreground" />
                          {job.qty} unit
                        </span>
                        <Badge variant={job.priority === "HIGH" ? "destructive" : job.priority === "MEDIUM" ? "default" : "secondary"} className="text-[9px] h-4">
                          {job.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Proses: {PHASE_LABELS[phase]}</span>
                      <span className={task.status === "IN_PROGRESS" ? "text-secondary" : task.status === "DONE" ? "text-primary" : ""}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    <div className="paracord-progress">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: task.status === "DONE" ? "100%" : task.status === "IN_PROGRESS" ? "50%" : "5%" }}
                        className="paracord-progress-fill"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {task.status === "PENDING" && (
                      <Button 
                        onClick={() => handleAction(job)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold group/btn"
                      >
                        Mulai {PHASE_LABELS[phase]}
                        <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                    {task.status === "IN_PROGRESS" && (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Button 
                          onClick={() => handleAction(job)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        >
                          <CheckCircle2 size={16} className="mr-2" /> Selesai
                        </Button>
                        <Button variant="outline" className="border-border hover:bg-muted/50">
                          <Camera size={16} className="mr-2" /> Foto
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="bg-card border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {selectedJob && (
                <>Update Progress: <span className="text-primary">{selectedJob.id}</span></>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted/30 border border-border flex gap-3">
              <Info size={18} className="text-primary shrink-0" />
              <div className="text-xs text-muted-foreground leading-relaxed">
                Anda akan memperbarui status tugas ke <span className="text-foreground font-bold italic">
                  {selectedJob?.tasks.find((t: any) => t.phase === phase)?.status === "PENDING" ? "Dalam Proses" : "Selesai"}
                </span>. Pastikan semua persyaratan telah terpenuhi.
              </div>
            </div>

            {phase === "QC" && selectedJob?.tasks.find((t: any) => t.phase === phase)?.status === "IN_PROGRESS" && (
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hasil Inspeksi</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setQcStatus("pass")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      qcStatus === "pass" ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,255,157,0.1)]" : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 size={18} />
                    <span className="font-bold">PASS</span>
                  </button>
                  <button 
                    onClick={() => setQcStatus("fail")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      qcStatus === "fail" ? "bg-destructive/10 border-destructive text-destructive shadow-[0_0_15px_rgba(255,0,0,0.1)]" : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    <XCircle size={18} />
                    <span className="font-bold">FAIL</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catatan / Keterangan</Label>
              <Textarea 
                placeholder="Masukkan catatan jika ada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-muted/50 border-border focus:ring-primary/20 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowActionDialog(false)} className="text-muted-foreground">Batal</Button>
            <Button 
              onClick={onConfirmUpdate}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8"
            >
              {loading ? "Memproses..." : "Konfirmasi Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

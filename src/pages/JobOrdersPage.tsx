import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_JOB_ORDERS, MOCK_PRODUCTS, PHASE_LABELS, WIP_PERCENTAGES } from "@/data/mockData";
import type { JobOrder } from "@/data/mockData";
import { ClipboardList, Plus, ChevronDown, ChevronUp, Package, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-600/20 text-blue-400",
  in_progress: "bg-secondary/20 text-secondary",
  completed: "bg-primary/20 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  scheduled: "Dijadwalkan",
  in_progress: "Berjalan",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const JobOrdersPage = () => {
  const [jobs, setJobs] = useState<JobOrder[]>(MOCK_JOB_ORDERS);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPriority, setNewPriority] = useState<string>("medium");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const handleCreateJob = () => {
    const product = MOCK_PRODUCTS.find((p) => p.id === newProductId);
    if (!product || !newQty || !newStart || !newEnd) return;

    const newJob: JobOrder = {
      id: `JO-2025-${String(jobs.length + 1).padStart(3, "0")}`,
      productId: product.id,
      productName: product.name,
      qty: parseInt(newQty),
      status: "scheduled",
      priority: newPriority as any,
      progress: 0,
      wipPhase: "bahan",
      plannedStart: newStart,
      plannedEnd: newEnd,
      tasks: product.routing.map((phase, i) => ({
        id: `tn-${Date.now()}-${i}`,
        jobId: "",
        phase: phase as any,
        status: "pending" as const,
      })),
      materialConsumption: product.bom.map((b) => ({
        materialName: b.materialName,
        planned: b.qtyPerUnit * parseInt(newQty),
        actual: 0,
        unit: b.unit,
      })),
      createdAt: new Date().toISOString().split("T")[0],
    };
    newJob.tasks.forEach((t) => (t.jobId = newJob.id));
    setJobs([newJob, ...jobs]);
    setShowCreate(false);
    setNewProductId("");
    setNewQty("");
    setNewStart("");
    setNewEnd("");
  };

  const updateJobStatus = (id: string, status: JobOrder["status"]) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Job Orders</h1>
          </div>
          <p className="text-sm text-muted-foreground">{jobs.length} job order terdaftar</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Buat Job Order
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-heading">Buat Job Order Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-muted-foreground">Produk</Label>
                <Select value={newProductId} onValueChange={setNewProductId}>
                  <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Pilih produk" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {MOCK_PRODUCTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BOM Preview & Stock Check */}
              {newProductId && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2">Pengecekan Stok Bahan:</p>
                  {MOCK_PRODUCTS.find((p) => p.id === newProductId)?.bom.map((b) => {
                    const totalNeeded = b.qtyPerUnit * (parseInt(newQty) || 0);
                    const isLow = totalNeeded > 100; // Mock check
                    return (
                      <div key={b.materialId} className="flex justify-between items-center text-xs py-1 border-b border-border/50 last:border-0">
                        <span className="flex items-center gap-1.5">
                          {isLow && <AlertTriangle size={12} className="text-secondary" />}
                          {b.materialName}
                        </span>
                        <div className="text-right">
                          <span className="font-mono block">{totalNeeded} {b.unit}</span>
                          {isLow && <span className="text-[10px] text-secondary font-bold uppercase tracking-tighter italic">Low Stock Alert!</span>}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground">Jumlah Unit</Label>
                  <Input type="number" value={newQty} onChange={(e) => setNewQty(e.target.value)} className="bg-muted/50 border-border" placeholder="50" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioritas</Label>
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="high">Tinggi</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="low">Rendah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground">Tanggal Mulai</Label>
                  <Input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="bg-muted/50 border-border" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Tanggal Selesai</Label>
                  <Input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="bg-muted/50 border-border" />
                </div>
              </div>
              <Button onClick={handleCreateJob} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Buat Job Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Job Order List */}
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
                    <span className="text-xs font-mono text-muted-foreground">{job.id}</span>
                    <Badge className={`text-[10px] ${statusColors[job.status]}`}>{statusLabels[job.status]}</Badge>
                    <Badge variant={job.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">
                      {job.priority === "high" ? "Tinggi" : job.priority === "medium" ? "Sedang" : "Rendah"}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-heading font-semibold mt-1">{job.productName}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Package size={11} />{job.qty} unit</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{job.plannedStart} → {job.plannedEnd}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">WIP</p>
                  <p className="text-lg font-heading font-bold text-primary">{job.progress}%</p>
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
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">Kontrol Produksi</p>
                        <div className="flex flex-wrap gap-2">
                          {job.status === "scheduled" && (
                            <Button size="sm" onClick={() => updateJobStatus(job.id, "in_progress")} className="h-8 bg-primary text-primary-foreground font-bold text-[10px] tracking-wider">
                              RELEASE JO
                            </Button>
                          )}
                          {job.status === "in_progress" && (
                            <Button size="sm" onClick={() => updateJobStatus(job.id, "scheduled")} variant="outline" className="h-8 border-secondary text-secondary hover:bg-secondary/10 font-bold text-[10px] tracking-wider">
                              HOLD JO
                            </Button>
                          )}
                          {job.status !== "cancelled" && job.status !== "completed" && (
                            <Button size="sm" onClick={() => updateJobStatus(job.id, "cancelled")} variant="ghost" className="h-8 text-destructive hover:bg-destructive/10 font-bold text-[10px] tracking-wider">
                              CANCEL
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/20 border border-border">
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">Estimasi Selesai</p>
                        <p className="text-sm font-bold">{job.plannedEnd}</p>
                        <p className="text-[10px] text-muted-foreground">Tepat waktu (On Schedule)</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/20 border border-border">
                        <p className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-widest mb-2">PIC Bertanggung Jawab</p>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border border-background bg-muted flex items-center justify-center text-[8px] font-bold">P{i}</div>
                          ))}
                          <div className="w-6 h-6 rounded-full border border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">+2</div>
                        </div>
                      </div>
                    </div>

                    {/* Workflow Progress */}
                    <div>
                      <p className="text-xs font-heading font-semibold text-muted-foreground mb-3">WORKFLOW PROGRESS</p>
                      <div className="flex gap-2">
                        {job.tasks.map((t) => (
                          <div key={t.id} className="flex-1">
                            <div className={`h-2 rounded-full mb-1 ${t.status === "done" ? "bg-primary" : t.status === "in_progress" ? "bg-secondary animate-pulse" : "bg-muted"}`} />
                            <p className="text-[10px] text-center text-muted-foreground">{PHASE_LABELS[t.phase]}</p>
                            <p className="text-[10px] text-center font-mono text-muted-foreground/60">{WIP_PERCENTAGES[t.phase]}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Material Consumption */}
                    {job.materialConsumption.length > 0 && (
                      <div>
                        <p className="text-xs font-heading font-semibold text-muted-foreground mb-3">KONSUMSI BAHAN (Actual vs Planned)</p>
                        <div className="space-y-2">
                          {job.materialConsumption.map((mc) => (
                            <div key={mc.materialName}>
                              <div className="flex justify-between text-xs mb-1">
                                <span>{mc.materialName}</span>
                                <span className="font-mono">{mc.actual}/{mc.planned} {mc.unit}</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${mc.actual > mc.planned ? "bg-destructive" : "bg-primary"}`}
                                  style={{ width: `${Math.min((mc.actual / mc.planned) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobOrdersPage;

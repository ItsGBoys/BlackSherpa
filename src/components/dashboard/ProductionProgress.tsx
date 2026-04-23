import { motion } from "framer-motion";

interface Job {
  id: string;
  product: string;
  qty: number;
  progress: number;
  phase: string;
  priority: "high" | "medium" | "low";
}

const mockJobs: Job[] = [
  { id: "JO-2025-001", product: "Tenda Ultralight 2P - Summit", qty: 50, progress: 85, phase: "QC", priority: "high" },
  { id: "JO-2025-002", product: "Tarp Shelter 3x4 - Ridge", qty: 100, progress: 55, phase: "Produksi", priority: "medium" },
  { id: "JO-2025-003", product: "Bivak Bag - Alpine", qty: 30, progress: 25, phase: "Potong", priority: "high" },
  { id: "JO-2025-004", product: "Rainfly 2P - Storm", qty: 75, progress: 10, phase: "Bahan", priority: "low" },
];

const priorityColors = { high: "text-secondary", medium: "text-primary", low: "text-muted-foreground" };
const priorityLabels = { high: "Tinggi", medium: "Sedang", low: "Rendah" };

const ProductionProgress = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="rounded-xl border border-border bg-card p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-heading font-semibold text-lg">Progres Produksi Aktif</h3>
      <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
        {mockJobs.length} Job Order
      </span>
    </div>

    <div className="space-y-5">
      {mockJobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-muted-foreground font-mono">{job.id}</span>
              <p className="text-sm font-medium">{job.product}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium ${priorityColors[job.priority]}`}>
                {priorityLabels[job.priority]}
              </span>
              <p className="text-xs text-muted-foreground">{job.qty} unit · {job.phase}</p>
            </div>
          </div>

          {/* Trekking path progress bar */}
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
            {/* Trail markers */}
            {[10, 25, 55, 85, 100].map((marker) => (
              <div
                key={marker}
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-muted-foreground/30"
                style={{ left: `${marker}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">WIP {job.progress}%</span>
            <span className="text-[10px] text-muted-foreground">Target 100%</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default ProductionProgress;

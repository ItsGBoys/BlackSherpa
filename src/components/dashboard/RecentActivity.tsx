import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Package, Scissors, Truck } from "lucide-react";

const activities = [
  { icon: CheckCircle, color: "text-primary", text: "QC Pass — Tenda Ultralight 2P batch #12", time: "5 menit lalu" },
  { icon: AlertTriangle, color: "text-secondary", text: "Low Stock Alert — Ripstop Nylon 20D (sisa 15m)", time: "12 menit lalu" },
  { icon: Scissors, color: "text-foreground", text: "Potong selesai — Bivak Bag Alpine (30 unit)", time: "28 menit lalu" },
  { icon: Package, color: "text-primary", text: "Seal & Packing — Tarp Shelter 3x4 (50/100)", time: "1 jam lalu" },
  { icon: Truck, color: "text-secondary", text: "Pengiriman #SHP-045 dikirim ke Jakarta", time: "2 jam lalu" },
];

const RecentActivity = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="rounded-xl border border-border bg-card p-6"
  >
    <h3 className="font-heading font-semibold text-lg mb-6">Aktivitas Terbaru</h3>
    <div className="space-y-4">
      {activities.map((act, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.08 }}
          className="flex items-start gap-3 group"
        >
          <div className={`mt-0.5 ${act.color}`}>
            <act.icon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">{act.text}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default RecentActivity;

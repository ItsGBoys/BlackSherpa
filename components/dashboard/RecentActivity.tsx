"use client";

import { motion } from "framer-motion";
import { History, Package, ShieldCheck, Truck } from "lucide-react";

const activities = [
  { id: 1, type: "production", text: "JO-2025-001 Selesai QC Pass", time: "5 menit lalu", icon: ShieldCheck, color: "text-primary" },
  { id: 2, type: "shipping", text: "JO-2025-004 Dikirim ke JNE", time: "1 jam lalu", icon: Truck, color: "text-secondary" },
  { id: 3, type: "material", text: "Stok Ripstop Nylon Menipis", time: "2 jam lalu", icon: Package, color: "text-destructive" },
];

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <History size={18} className="text-primary" />
        <h3 className="font-heading font-semibold text-lg">Aktivitas Terkini</h3>
      </div>

      <div className="space-y-6">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex gap-4 relative"
          >
            {i !== activities.length - 1 && (
              <div className="absolute left-[17px] top-8 bottom-[-24px] w-px bg-border" />
            )}
            <div className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 ${activity.color}`}>
              <activity.icon size={16} />
            </div>
            <div>
              <p className="text-sm font-medium leading-none mb-1">{activity.text}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

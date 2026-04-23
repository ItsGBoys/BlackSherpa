import { History, Package, ShieldCheck, Truck } from "lucide-react";
import { prisma } from "@/lib/prisma";

function iconByAction(action: string) {
  if (action.includes("QC") || action.includes("UPDATE_TASK_STATUS")) return ShieldCheck;
  if (action.includes("MATERIAL")) return Package;
  if (action.includes("SHIPPING") || action.includes("RELEASE")) return Truck;
  return History;
}

function colorByAction(action: string) {
  if (action.includes("MATERIAL")) return "text-destructive";
  if (action.includes("RELEASE") || action.includes("SHIPPING")) return "text-secondary";
  return "text-primary";
}

export default async function RecentActivity() {
  const activities = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <History size={18} className="text-primary" />
        <h3 className="font-heading font-semibold text-lg">Aktivitas Terkini</h3>
      </div>

      <div className="space-y-6">
        {activities.map((activity, i) => {
          const Icon = iconByAction(activity.action);
          const color = colorByAction(activity.action);
          return (
            <div
              key={activity.id}
              className="flex gap-4 relative"
            >
              {i !== activities.length - 1 && (
                <div className="absolute left-[17px] top-8 bottom-[-24px] w-px bg-border" />
              )}
              <div className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium leading-none mb-1">{activity.details || activity.action}</p>
                <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString("id-ID")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

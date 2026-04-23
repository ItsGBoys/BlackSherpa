import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "mint" | "orange" | "default";
  delay?: number;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default", delay = 0 }: StatsCardProps) => {
  const glowClass = variant === "mint" ? "glow-mint" : variant === "orange" ? "glow-orange" : "";
  const iconColor = variant === "mint" ? "text-primary" : variant === "orange" ? "text-secondary" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-xl border border-border bg-card p-6 ripple-effect ${glowClass}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-heading font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.positive ? "text-primary" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% dari kemarin
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-muted/50 ${iconColor}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

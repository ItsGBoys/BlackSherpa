"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ClipboardList,
  Database,
  DollarSign,
  Factory,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP = {
  DOLLAR_SIGN: DollarSign,
  USERS: Users,
  TRENDING_UP: TrendingUp,
  ALERT_TRIANGLE: AlertTriangle,
  CLIPBOARD_LIST: ClipboardList,
  FACTORY: Factory,
  SHIELD_CHECK: ShieldCheck,
  TRUCK: Truck,
  DATABASE: Database,
} as const;

type StatsIconKey = keyof typeof ICON_MAP;

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: StatsIconKey;
  trend?: { value: number; positive: boolean };
  variant?: "mint" | "orange" | "default";
  delay?: number;
}

export default function StatsCard({ title, value, subtitle, icon, trend, variant = "default", delay = 0 }: StatsCardProps) {
  const Icon: LucideIcon = ICON_MAP[icon];
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
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-muted/50 ${iconColor}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}

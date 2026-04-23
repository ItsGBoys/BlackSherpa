import { useState } from "react";
import { motion } from "framer-motion";
import { MOCK_JOB_ORDERS } from "@/data/mockData";
import { Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DAYS_IN_VIEW = 30;
const START_DATE = new Date("2025-04-01");

const priorityBarColors: Record<string, string> = {
  high: "bg-secondary",
  medium: "bg-primary",
  low: "bg-muted-foreground/40",
};

const GanttChart = () => {
  const dates = Array.from({ length: DAYS_IN_VIEW }, (_, i) => {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getOffset = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (d.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, diff);
  };

  const getDuration = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return Math.max(1, (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Gantt Chart & Penjadwalan</h1>
        </div>
        <p className="text-sm text-muted-foreground">Timeline produksi April 2025</p>
      </motion.div>

      {/* Calendar Overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h3 className="font-heading font-semibold text-sm">Kalender Produksi</h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
            <div key={d} className="text-[10px] text-center text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {/* Offset for April 2025 (starts on Tuesday) */}
          <div /><div />
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const date = new Date(2025, 3, day);
            const isToday = date.toDateString() === today.toDateString();
            const jobsOnDay = MOCK_JOB_ORDERS.filter((j) => {
              const start = new Date(j.plannedStart);
              const end = new Date(j.plannedEnd);
              return date >= start && date <= end;
            });
            return (
              <div
                key={day}
                className={`relative text-center py-2 rounded-lg text-xs transition-colors ${
                  isToday ? "bg-primary/20 text-primary font-bold ring-1 ring-primary/40" : "hover:bg-muted/40"
                }`}
              >
                {day}
                {jobsOnDay.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {jobsOnDay.slice(0, 3).map((j) => (
                      <div key={j.id} className={`w-1 h-1 rounded-full ${priorityBarColors[j.priority]}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Gantt */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Timeline Header */}
            <div className="flex border-b border-border">
              <div className="w-56 flex-shrink-0 px-4 py-2 text-xs font-heading font-semibold text-muted-foreground">Job Order</div>
              <div className="flex-1 flex">
                {dates.map((d, i) => {
                  const isToday = d.toDateString() === today.toDateString();
                  const isSunday = d.getDay() === 0;
                  return (
                    <div
                      key={i}
                      className={`flex-1 text-center text-[9px] py-2 border-l border-border/30 ${
                        isToday ? "bg-primary/10 text-primary font-bold" : isSunday ? "bg-muted/30 text-muted-foreground/50" : "text-muted-foreground"
                      }`}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Job Bars */}
            {MOCK_JOB_ORDERS.map((job, i) => {
              const offset = getOffset(job.plannedStart);
              const duration = getDuration(job.plannedStart, job.plannedEnd);
              const leftPercent = (offset / DAYS_IN_VIEW) * 100;
              const widthPercent = (duration / DAYS_IN_VIEW) * 100;

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex border-b border-border/30 hover:bg-muted/10 transition-colors"
                >
                  <div className="w-56 flex-shrink-0 px-4 py-3">
                    <p className="text-xs font-mono text-muted-foreground">{job.id}</p>
                    <p className="text-xs font-medium truncate">{job.productName}</p>
                    <Badge className={`text-[9px] mt-1 ${priorityBarColors[job.priority]} border-0`}>
                      {job.qty} unit
                    </Badge>
                  </div>
                  <div className="flex-1 relative py-3">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {dates.map((d, ii) => (
                        <div key={ii} className={`flex-1 border-l border-border/10 ${d.getDay() === 0 ? "bg-muted/10" : ""}`} />
                      ))}
                    </div>
                    {/* Bar */}
                    <motion.div
                      className={`absolute top-1/2 -translate-y-1/2 h-6 rounded-md ${priorityBarColors[job.priority]} opacity-80`}
                      style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    >
                      {/* Progress overlay */}
                      <div className="h-full rounded-md bg-foreground/20" style={{ width: `${job.progress}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
                        {job.progress}%
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-secondary" /> Prioritas Tinggi</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary" /> Prioritas Sedang</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-muted-foreground/40" /> Prioritas Rendah</span>
      </div>
    </div>
  );
};

export default GanttChart;

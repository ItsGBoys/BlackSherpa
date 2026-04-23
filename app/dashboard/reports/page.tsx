import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientMotionDiv from "@/components/ClientMotionDiv";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ReportsPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const jobs = await prisma.jobOrder.findMany({
    include: { product: true },
  });
  const materials = await prisma.material.findMany();

  const lowStockCount = materials.filter((m) => m.stock <= m.minStock).length;
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");
  const onTimeCompleted = completedJobs.filter(
    (j) => j.actualEnd && j.plannedEnd && j.actualEnd <= j.plannedEnd
  ).length;
  const onTimeRate = completedJobs.length > 0 ? (onTimeCompleted / completedJobs.length) * 100 : 0;
  const avgWipProgress = jobs.length > 0 ? jobs.reduce((acc, j) => acc + j.progress, 0) / jobs.length : 0;
  const estimatedMaterialValue = materials.reduce((acc, m) => acc + m.stock * m.pricePerUnit, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ClientMotionDiv>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Laporan Produksi</h1>
          </div>
          <p className="text-sm text-muted-foreground">Analitik efisiensi dan rekapitulasi data</p>
        </ClientMotionDiv>
        <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-bold">
          <Link href="/api/reports/production">
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-heading font-bold mb-4">Efisiensi Bahan Baku</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Jumlah material</span><span className="font-semibold">{materials.length}</span></div>
            <div className="flex justify-between"><span>Low stock item</span><span className="font-semibold text-secondary">{lowStockCount}</span></div>
            <div className="flex justify-between"><span>Estimasi nilai stok</span><span className="font-semibold">Rp {Math.round(estimatedMaterialValue).toLocaleString("id-ID")}</span></div>
            <div className="flex justify-between"><span>Rata-rata progress WIP</span><span className="font-semibold">{avgWipProgress.toFixed(1)}%</span></div>
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-heading font-bold mb-4">Output Produksi Mingguan</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Total Job Order</span><span className="font-semibold">{jobs.length}</span></div>
            <div className="flex justify-between"><span>Job Completed</span><span className="font-semibold text-primary">{completedJobs.length}</span></div>
            <div className="flex justify-between"><span>On-time delivery</span><span className="font-semibold">{onTimeRate.toFixed(1)}%</span></div>
            <div className="flex justify-between"><span>Job in progress</span><span className="font-semibold">{jobs.filter((j) => j.status === "IN_PROGRESS").length}</span></div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-heading font-bold mb-4">History & Traceability (20 Aktivitas Terakhir)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                <th className="text-left py-2">Waktu</th>
                <th className="text-left py-2">Aksi</th>
                <th className="text-left py-2">Job</th>
                <th className="text-left py-2">User</th>
                <th className="text-left py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 align-top">
                  <td className="py-2 pr-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString("id-ID")}</td>
                  <td className="py-2 pr-4 font-semibold">{log.action}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{log.jobId || "-"}</td>
                  <td className="py-2 pr-4">{log.user?.name || log.user?.email || "-"}</td>
                  <td className="py-2 text-muted-foreground">{log.details || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

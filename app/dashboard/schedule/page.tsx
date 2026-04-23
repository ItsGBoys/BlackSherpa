import { Calendar } from "lucide-react";
import ClientMotionDiv from "@/components/ClientMotionDiv";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await prisma.jobOrder.findMany({
    where: {
      status: {
        in: ["DRAFT", "SCHEDULED", "IN_PROGRESS"],
      },
    },
    orderBy: [{ plannedStart: "asc" }, { createdAt: "desc" }],
    take: 30,
  });

  return (
    <div className="space-y-6">
      <ClientMotionDiv>
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold">Penjadwalan Produksi</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gantt Chart & Kalender Operasional</p>
      </ClientMotionDiv>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-left px-4 py-3">Job</th>
              <th className="text-left px-4 py-3">Produk</th>
              <th className="text-center px-4 py-3">Qty</th>
              <th className="text-center px-4 py-3">Mulai</th>
              <th className="text-center px-4 py-3">Target</th>
              <th className="text-center px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-mono text-xs">{job.id.slice(-8)}</td>
                <td className="px-4 py-3">{job.productName}</td>
                <td className="px-4 py-3 text-center">{job.qty}</td>
                <td className="px-4 py-3 text-center">{job.plannedStart ? new Date(job.plannedStart).toLocaleDateString("id-ID") : "-"}</td>
                <td className="px-4 py-3 text-center">{job.plannedEnd ? new Date(job.plannedEnd).toLocaleDateString("id-ID") : "-"}</td>
                <td className="px-4 py-3 text-center">{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

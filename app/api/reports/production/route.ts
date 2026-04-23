import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function csvEscape(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const jobs = await prisma.jobOrder.findMany({
    include: {
      tasks: true,
      product: true,
      wipLogs: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "job_id",
    "product_sku",
    "product_name",
    "qty",
    "status",
    "priority",
    "progress_percent",
    "macro_phase",
    "wip_phase",
    "planned_start",
    "planned_end",
    "actual_start",
    "actual_end",
    "task_done_count",
    "task_total",
    "wip_log_count",
  ];

  const rows = jobs.map((job) => {
    const doneCount = job.tasks.filter((task) => task.status === "DONE").length;
    const macroPhase =
      !job.wipPhase || job.wipPhase === "PENGAMBILAN_BAHAN"
        ? "Pengambilan Bahan Baku"
        : job.wipPhase === "DIKIRIM"
          ? "Selesai"
          : "Proses Bahan Baku";

    return [
      job.id,
      job.product.sku,
      job.productName,
      job.qty,
      job.status,
      job.priority,
      Math.round(job.progress * 100) / 100,
      macroPhase,
      job.wipPhase || "",
      job.plannedStart?.toISOString() || "",
      job.plannedEnd?.toISOString() || "",
      job.actualStart?.toISOString() || "",
      job.actualEnd?.toISOString() || "",
      doneCount,
      job.tasks.length,
      job.wipLogs.length,
    ].map(csvEscape);
  });

  const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const filename = `laporan-produksi-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

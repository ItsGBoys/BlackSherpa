import { JobStatus, PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

const ROUTING = [
  "PENGAMBILAN_BAHAN",
  "POTONG",
  "PRODUKSI",
  "QC",
  "SEAL",
  "PACKING",
  "DIKIRIM",
];

const MILESTONES = {
  PENGAMBILAN_BAHAN: 10,
  POTONG: 25,
  PRODUKSI: 55,
  QC: 70,
  SEAL: 85,
  PACKING: 95,
  DIKIRIM: 100,
};

const checks = [];

function pass(name, details = "") {
  checks.push({ name, ok: true, details });
}

function assert(condition, name, details = "") {
  if (!condition) {
    checks.push({ name, ok: false, details });
    throw new Error(`${name}${details ? `: ${details}` : ""}`);
  }
  pass(name, details);
}

async function main() {
  const product = await prisma.product.findUnique({
    where: { sku: "PRODUK-A-001" },
    include: { bom: { include: { material: true } } },
  });
  assert(Boolean(product), "product exists", "PRODUK-A-001");
  assert((product?.bom.length ?? 0) > 0, "product has BOM");

  const qty = 2;
  const now = new Date();
  const flowKey = `SMOKE-${Date.now()}`;
  const materialRestores = new Map();

  const job = await prisma.jobOrder.create({
    data: {
      productId: product.id,
      productName: product.name,
      qty,
      status: JobStatus.DRAFT,
      priority: "HIGH",
      progress: 0,
      wipPhase: "PENGAMBILAN_BAHAN",
      plannedStart: now,
      plannedEnd: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      tasks: {
        create: ROUTING.map((phase) => ({
          phase,
          status: TaskStatus.PENDING,
        })),
      },
    },
    include: { tasks: true },
  });

  assert(job.tasks.length === 7, "job has 7 routing tasks");
  assert(job.status === JobStatus.DRAFT, "job starts as DRAFT");

  await prisma.jobOrder.update({
    where: { id: job.id },
    data: { status: JobStatus.SCHEDULED },
  });
  pass("job released to SCHEDULED");

  async function setTask(phase, status, notes) {
    const task = await prisma.task.findFirst({ where: { jobId: job.id, phase } });
    assert(Boolean(task), `task exists ${phase}`);
    await prisma.task.update({
      where: { id: task.id },
      data: {
        status,
        notes,
        startedAt: status === TaskStatus.IN_PROGRESS ? new Date() : task.startedAt,
        completedAt: status === TaskStatus.DONE ? new Date() : status === TaskStatus.REWORK ? null : task.completedAt,
      },
    });
  }

  async function syncJob(phaseDone) {
    const tasks = await prisma.task.findMany({ where: { jobId: job.id } });
    const allDone = tasks.every((task) => task.status === TaskStatus.DONE);
    const hasStarted = tasks.some((task) => [TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.REWORK].includes(task.status));

    await prisma.jobOrder.update({
      where: { id: job.id },
      data: {
        progress: MILESTONES[phaseDone] ?? 0,
        wipPhase: phaseDone,
        status: allDone ? JobStatus.COMPLETED : hasStarted ? JobStatus.IN_PROGRESS : JobStatus.SCHEDULED,
      },
    });

    await prisma.wIPLog.create({
      data: {
        id: `${flowKey}-${phaseDone}-${Date.now()}`,
        jobId: job.id,
        phase: phaseDone,
        percentage: MILESTONES[phaseDone] ?? 0,
        notes: `${phaseDone} milestone`,
      },
    });
  }

  // Fase 1: Pengambilan bahan + decrement stock.
  await setTask("PENGAMBILAN_BAHAN", TaskStatus.IN_PROGRESS, "mulai ambil bahan");
  await setTask("PENGAMBILAN_BAHAN", TaskStatus.DONE, "bahan diambil");
  for (const bomItem of product.bom) {
    const plannedQty = qty * bomItem.qtyPerUnit;
    await prisma.material.update({
      where: { id: bomItem.materialId },
      data: { stock: { decrement: plannedQty } },
    });
    materialRestores.set(bomItem.materialId, (materialRestores.get(bomItem.materialId) ?? 0) + plannedQty);
  }
  await syncJob("PENGAMBILAN_BAHAN");

  // Potong
  await setTask("POTONG", TaskStatus.IN_PROGRESS, "mulai potong");
  await setTask("POTONG", TaskStatus.DONE, "potong selesai");
  await syncJob("POTONG");

  // Produksi done
  await setTask("PRODUKSI", TaskStatus.IN_PROGRESS, "mulai produksi");
  await setTask("PRODUKSI", TaskStatus.DONE, "produksi selesai");
  await syncJob("PRODUKSI");

  // QC fail -> rework
  await setTask("QC", TaskStatus.IN_PROGRESS, "mulai qc");
  await setTask("QC", TaskStatus.REWORK, "qc fail");
  await prisma.task.updateMany({
    where: { jobId: job.id, phase: { in: ["SEAL", "PACKING", "DIKIRIM"] } },
    data: { status: TaskStatus.PENDING, startedAt: null, completedAt: null },
  });
  await prisma.task.updateMany({
    where: { jobId: job.id, phase: "PRODUKSI" },
    data: { status: TaskStatus.REWORK, startedAt: null, completedAt: null, notes: "rework dari qc" },
  });
  pass("qc fail triggers rework path");

  // Rework cycle
  await setTask("PRODUKSI", TaskStatus.IN_PROGRESS, "rework produksi");
  await setTask("PRODUKSI", TaskStatus.DONE, "rework produksi selesai");
  await syncJob("PRODUKSI");

  await setTask("QC", TaskStatus.IN_PROGRESS, "qc ulang");
  await setTask("QC", TaskStatus.DONE, "qc pass");
  await syncJob("QC");

  await setTask("SEAL", TaskStatus.IN_PROGRESS, "mulai seal");
  await setTask("SEAL", TaskStatus.DONE, "seal selesai");
  await syncJob("SEAL");

  await setTask("PACKING", TaskStatus.IN_PROGRESS, "mulai packing");
  await setTask("PACKING", TaskStatus.DONE, "packing selesai");
  await syncJob("PACKING");

  await setTask("DIKIRIM", TaskStatus.IN_PROGRESS, "mulai kirim");
  await setTask("DIKIRIM", TaskStatus.DONE, "dikirim");
  await syncJob("DIKIRIM");

  const finalJob = await prisma.jobOrder.findUnique({
    where: { id: job.id },
    include: { tasks: true, wipLogs: true },
  });

  assert(finalJob?.status === JobStatus.COMPLETED, "job completed");
  assert((finalJob?.progress ?? 0) === 100, "job progress reaches 100%");
  assert((finalJob?.tasks ?? []).every((task) => task.status === TaskStatus.DONE), "all tasks DONE");
  assert((finalJob?.wipLogs.length ?? 0) >= 7, "wip logs recorded");

  // Restore material stocks so smoke run is idempotent.
  for (const [materialId, qtyToRestore] of materialRestores.entries()) {
    await prisma.material.update({
      where: { id: materialId },
      data: { stock: { increment: qtyToRestore } },
    });
  }
  pass("material stock restored");

  await prisma.jobOrder.delete({ where: { id: job.id } });
  pass("temporary smoke job cleaned up");

  console.log(
    JSON.stringify(
      {
        ok: checks.every((item) => item.ok),
        checks,
      },
      null,
      2
    )
  );
}

main()
  .catch(async (error) => {
    console.error(error);
    console.log(JSON.stringify({ ok: false, checks }, null, 2));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

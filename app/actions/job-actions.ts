"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { JobStatus, Priority, TaskStatus } from "@prisma/client";

const DEFAULT_ROUTING_7_DIVISI = [
  "PENGAMBILAN_BAHAN",
  "POTONG",
  "PRODUKSI",
  "QC",
  "SEAL",
  "PACKING",
  "DIKIRIM",
] as const;

const WIP_MILESTONES: Record<(typeof DEFAULT_ROUTING_7_DIVISI)[number], number> = {
  PENGAMBILAN_BAHAN: 10,
  POTONG: 25,
  PRODUKSI: 55,
  QC: 70,
  SEAL: 85,
  PACKING: 95,
  DIKIRIM: 100,
};

const PHASE_TO_PATH: Record<string, string> = {
  PENGAMBILAN_BAHAN: "/dashboard/warehouse",
  POTONG: "/dashboard/cutting",
  PRODUKSI: "/dashboard/production",
  QC: "/dashboard/qc",
  SEAL: "/dashboard/seal",
  PACKING: "/dashboard/shipping",
  DIKIRIM: "/dashboard/shipping",
};

function getPhaseIndex(phase: string) {
  return DEFAULT_ROUTING_7_DIVISI.indexOf(phase as (typeof DEFAULT_ROUTING_7_DIVISI)[number]);
}

function getJobStatusFromTasks(tasks: Array<{ status: TaskStatus }>) {
  const allDone = tasks.length > 0 && tasks.every((task) => task.status === TaskStatus.DONE);
  if (allDone) return JobStatus.COMPLETED;

  const hasStarted = tasks.some((task) =>
    task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.DONE || task.status === TaskStatus.REWORK
  );
  if (hasStarted) return JobStatus.IN_PROGRESS;

  return JobStatus.DRAFT;
}

function isAdminRole(role?: string) {
  return role === "ADMIN_PRODUKSI" || role === "SUPER_ADMIN";
}

function canUpdatePhase(role: string | undefined, phase: string) {
  if (!role) return false;
  if (isAdminRole(role)) return true;

  if (phase === "PENGAMBILAN_BAHAN" || phase === "POTONG") return role === "PIC_POTONG_GUDANG";
  if (phase === "PRODUKSI") return role === "PIC_PRODUKSI";
  if (phase === "QC") return role === "PIC_QC";
  if (phase === "SEAL") return role === "PIC_SEAL";
  if (phase === "PACKING" || phase === "DIKIRIM") return role === "PIC_PENGIRIMAN";
  return false;
}

export async function getJobsByPhase(phase: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  return await prisma.jobOrder.findMany({
    where: {
      tasks: {
        some: {
          phase: phase,
          status: { not: "DONE" },
        },
      },
      status: { in: [JobStatus.SCHEDULED, JobStatus.IN_PROGRESS] },
    },
    include: {
      tasks: true,
      product: {
        include: {
          bom: {
            include: {
              material: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

type CreateJobOrderInput = {
  productId: string;
  quantity: number;
  startDate: Date | string;
  targetDate: Date | string;
  priority: Priority;
};

type MaterialConsumptionInput = {
  materialId: string;
  actualQty: number;
};

export async function createJobOrder({
  productId,
  quantity,
  startDate,
  targetDate,
  priority,
}: CreateJobOrderInput) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role)) {
    throw new Error("Unauthorized");
  }

  const qty = Number(quantity);
  const plannedStart = new Date(startDate);
  const plannedEnd = new Date(targetDate);

  if (!productId || Number.isNaN(qty) || qty <= 0 || Number.isNaN(plannedStart.getTime()) || Number.isNaN(plannedEnd.getTime())) {
    throw new Error("Input job order tidak valid");
  }

  if (!priority || !Object.values(Priority).includes(priority)) {
    throw new Error("Priority tidak valid");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      bom: {
        include: {
          material: true,
        },
      },
    },
  });

  if (!product) throw new Error("Product not found");
  if (product.bom.length === 0) throw new Error("BOM produk belum tersedia");

  for (const bomItem of product.bom) {
    const totalDibutuhkan = qty * bomItem.qtyPerUnit;
    if (totalDibutuhkan > bomItem.material.stock) {
      throw new Error(`Stok ${bomItem.material.name} tidak cukup`);
    }
  }

  const jobOrder = await prisma.$transaction(async (tx) => {
    const createdJob = await tx.jobOrder.create({
      data: {
        productId,
        productName: product.name,
        qty,
        priority,
        plannedStart,
        plannedEnd,
        // Tidak ada enum PENDING di schema JobStatus, jadi start dari state paling awal.
        status: JobStatus.DRAFT,
        progress: 0,
        wipPhase: DEFAULT_ROUTING_7_DIVISI[0],
      },
    });

    await tx.task.createMany({
      data: DEFAULT_ROUTING_7_DIVISI.map((phase) => ({
        jobId: createdJob.id,
        phase,
        status: TaskStatus.PENDING,
      })),
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        jobId: createdJob.id,
        action: "CREATE_JOB_ORDER",
        details: `Membuat job order ${createdJob.id} untuk ${product.name} (${qty} unit).`,
      },
    });

    return createdJob;
  });

  revalidatePath("/dashboard/jobs");
  return jobOrder;
}

export async function updateTaskStatus(
  jobId: string,
  phase: string,
  status: TaskStatus,
  notes?: string,
  materialConsumptions?: MaterialConsumptionInput[]
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  if (!canUpdatePhase(session.user.role, phase)) {
    throw new Error("Role kamu tidak punya akses update fase ini");
  }

  const phaseIndex = getPhaseIndex(phase);
  if (phaseIndex === -1) throw new Error("Phase tidak dikenali");
  if (status !== TaskStatus.IN_PROGRESS && status !== TaskStatus.DONE && status !== TaskStatus.REWORK) {
    throw new Error("Status task tidak valid untuk update progress");
  }

  await prisma.$transaction(async (tx) => {
    const job = await tx.jobOrder.findUnique({
      where: { id: jobId },
      include: { tasks: true },
    });
    if (!job) throw new Error("Job order tidak ditemukan");
    if (job.status === JobStatus.DRAFT) {
      throw new Error("Job order belum direlease, belum bisa diproses");
    }
    if (job.status === JobStatus.CANCELLED) {
      throw new Error("Job order sudah dibatalkan");
    }

    const tasksByPhase = new Map(job.tasks.map((task) => [task.phase, task]));
    const currentTask = tasksByPhase.get(phase);
    if (!currentTask) throw new Error("Task not found");

    const previousPhases = DEFAULT_ROUTING_7_DIVISI.slice(0, phaseIndex);
    const previousDone = previousPhases.every((prevPhase) => tasksByPhase.get(prevPhase)?.status === TaskStatus.DONE);
    if (!previousDone) {
      throw new Error("Tahap sebelumnya belum selesai");
    }

    if (status === TaskStatus.IN_PROGRESS && currentTask.status !== TaskStatus.PENDING && currentTask.status !== TaskStatus.REWORK) {
      throw new Error("Task ini tidak bisa dimulai dari status sekarang");
    }
    if (status === TaskStatus.DONE && currentTask.status !== TaskStatus.IN_PROGRESS) {
      throw new Error("Task harus IN_PROGRESS sebelum ditandai DONE");
    }
    if (status === TaskStatus.REWORK && phase !== "QC") {
      throw new Error("Status REWORK hanya bisa dari fase QC");
    }

    await tx.task.update({
      where: { id: currentTask.id },
      data: {
        status,
        notes,
        completedAt: status === TaskStatus.DONE ? new Date() : null,
        startedAt: status === TaskStatus.IN_PROGRESS && !currentTask.startedAt ? new Date() : currentTask.startedAt,
      },
    });

    // Saat pengambilan bahan selesai, stok bahan baku dikurangi berdasarkan BOM x Qty job.
    if (phase === "PENGAMBILAN_BAHAN" && status === TaskStatus.DONE) {
      const jobWithBom = await tx.jobOrder.findUnique({
        where: { id: jobId },
        include: {
          product: {
            include: {
              bom: {
                include: {
                  material: true,
                },
              },
            },
          },
        },
      });

      if (!jobWithBom) throw new Error("Job order tidak ditemukan untuk pengurangan stok");

      for (const bomItem of jobWithBom.product.bom) {
        const plannedQty = jobWithBom.qty * bomItem.qtyPerUnit;
        const actualFromInput = materialConsumptions?.find((item) => item.materialId === bomItem.materialId)?.actualQty;
        const actualQty = actualFromInput && actualFromInput > 0 ? actualFromInput : plannedQty;
        const variance = actualQty - plannedQty;

        if (bomItem.material.stock < actualQty) {
          throw new Error(`Stok ${bomItem.material.name} tidak cukup saat ambil bahan`);
        }

        await tx.material.update({
          where: { id: bomItem.materialId },
          data: {
            stock: {
              decrement: actualQty,
            },
          },
        });

        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            jobId,
            action: "MATERIAL_CONSUMPTION",
            details: [
              `Material: ${bomItem.material.name}`,
              `Planned: ${plannedQty} ${bomItem.unit}`,
              `Actual: ${actualQty} ${bomItem.unit}`,
              `Variance: ${variance} ${bomItem.unit}`,
            ].join(" | "),
          },
        });
      }
    }

    // Divisi pengiriman menangani packing + konfirmasi kirim, jadi tahap DIKIRIM ditutup saat packing selesai.
    if (phase === "PACKING" && status === TaskStatus.DONE) {
      const shippingTask = tasksByPhase.get("DIKIRIM");
      if (shippingTask && shippingTask.status !== TaskStatus.DONE) {
        await tx.task.update({
          where: { id: shippingTask.id },
          data: {
            status: TaskStatus.DONE,
            startedAt: shippingTask.startedAt ?? new Date(),
            completedAt: new Date(),
            notes: shippingTask.notes ?? "Dikirim otomatis setelah packing selesai",
          },
        });

        await tx.wIPLog.create({
          data: {
            jobId,
            phase: "DIKIRIM",
            percentage: WIP_MILESTONES.DIKIRIM,
            notes: "Dikirim otomatis setelah packing selesai",
          },
        });
      }
    }

    // Jika QC fail, sistem otomatis buat siklus rework ke Produksi.
    if (phase === "QC" && status === TaskStatus.REWORK) {
      const produksiTask = tasksByPhase.get("PRODUKSI");
      if (produksiTask) {
        await tx.task.update({
          where: { id: produksiTask.id },
          data: {
            status: TaskStatus.REWORK,
            startedAt: null,
            completedAt: null,
            notes: `Rework dari QC: ${notes || "Perlu perbaikan produksi"}`,
          },
        });
      }

      const downstreamPhases = ["SEAL", "PACKING", "DIKIRIM"];
      for (const downstreamPhase of downstreamPhases) {
        const downstreamTask = tasksByPhase.get(downstreamPhase);
        if (downstreamTask) {
          await tx.task.update({
            where: { id: downstreamTask.id },
            data: {
              status: TaskStatus.PENDING,
              startedAt: null,
              completedAt: null,
            },
          });
        }
      }

      await tx.wIPLog.create({
        data: {
          jobId,
          phase: "QC",
          percentage: WIP_MILESTONES.QC,
          notes: notes || "QC fail, otomatis buat rework ke Produksi",
        },
      });
    }

    const updatedTasks = await tx.task.findMany({ where: { jobId } });
    const sortedByRouting = [...updatedTasks].sort(
      (a, b) => getPhaseIndex(a.phase) - getPhaseIndex(b.phase)
    );

    const doneIndices = sortedByRouting
      .filter((task) => task.status === TaskStatus.DONE)
      .map((task) => getPhaseIndex(task.phase))
      .filter((idx) => idx >= 0);
    const highestDoneIndex = doneIndices.length > 0 ? Math.max(...doneIndices) : -1;
    const progressPhase =
      highestDoneIndex >= 0 ? DEFAULT_ROUTING_7_DIVISI[highestDoneIndex] : DEFAULT_ROUTING_7_DIVISI[0];
    const progress = highestDoneIndex >= 0 ? WIP_MILESTONES[progressPhase] : 0;

    const activeTask = sortedByRouting.find((task) => task.status === TaskStatus.IN_PROGRESS);
    const wipPhase = activeTask?.phase || progressPhase;

    await tx.jobOrder.update({
      where: { id: jobId },
      data: {
        progress,
        wipPhase,
        status: getJobStatusFromTasks(updatedTasks.map((task) => ({ status: task.status }))),
      },
    });

    if (status === TaskStatus.DONE) {
      await tx.wIPLog.create({
        data: {
          jobId,
          phase,
          percentage: WIP_MILESTONES[phase as keyof typeof WIP_MILESTONES] ?? progress,
          notes: notes || `Tahap ${phase} selesai`,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        jobId,
        action: "UPDATE_TASK_STATUS",
        details: `Fase ${phase} diubah ke ${status}${notes ? ` | Catatan: ${notes}` : ""}`,
      },
    });
  });

  const phasePath = PHASE_TO_PATH[phase];
  if (phasePath) revalidatePath(phasePath);
  revalidatePath("/dashboard/jobs");
}

export async function releaseJobOrder(jobId: string) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role)) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const job = await tx.jobOrder.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job order tidak ditemukan");
    if (job.status === JobStatus.CANCELLED) throw new Error("Job order sudah dibatalkan");
    if (job.status !== JobStatus.DRAFT) throw new Error("Hanya job DRAFT yang bisa di-release");

    await tx.jobOrder.update({
      where: { id: jobId },
      data: {
        status: JobStatus.SCHEDULED,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        jobId,
        action: "RELEASE_JOB_ORDER",
        details: `Job order ${jobId} direlease ke lantai produksi.`,
      },
    });
  });

  revalidatePath("/dashboard/jobs");
}

export async function cancelJobOrder(jobId: string, reason?: string) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role)) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const job = await tx.jobOrder.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job order tidak ditemukan");
    if (job.status === JobStatus.COMPLETED) throw new Error("Job completed tidak bisa dibatalkan");

    await tx.jobOrder.update({
      where: { id: jobId },
      data: {
        status: JobStatus.CANCELLED,
      },
    });

    await tx.task.updateMany({
      where: {
        jobId,
        status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.REWORK] },
      },
      data: {
        status: TaskStatus.REWORK,
        notes: reason ? `Dibatalkan: ${reason}` : "Dibatalkan oleh admin",
      },
    });

    await tx.auditLog.create({
      data: {
        userId: session.user.id,
        jobId,
        action: "CANCEL_JOB_ORDER",
        details: reason || `Job order ${jobId} dibatalkan.`,
      },
    });
  });

  revalidatePath("/dashboard/jobs");
}

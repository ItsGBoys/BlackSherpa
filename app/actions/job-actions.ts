"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { JobStatus, Priority, TaskStatus } from "@prisma/client";

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
      status: { not: "CANCELLED" },
    },
    include: {
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createJobOrder(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN_PRODUKSI" && session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const productId = formData.get("productId") as string;
  const qty = parseInt(formData.get("qty") as string);
  const priority = formData.get("priority") as Priority;
  const plannedStart = new Date(formData.get("plannedStart") as string);
  const plannedEnd = new Date(formData.get("plannedEnd") as string);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { bom: true },
  });

  if (!product) throw new Error("Product not found");

  const jobOrder = await prisma.jobOrder.create({
    data: {
      productId,
      productName: product.name,
      qty,
      priority,
      plannedStart,
      plannedEnd,
      status: "SCHEDULED",
      tasks: {
        create: product.routing.map((phase) => ({
          phase,
          status: "PENDING",
        })),
      },
    },
  });

  revalidatePath("/dashboard/jobs");
  return jobOrder;
}

export async function updateTaskStatus(jobId: string, phase: string, status: TaskStatus, notes?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const task = await prisma.task.findFirst({
    where: { jobId, phase },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: { id: task.id },
    data: {
      status,
      notes,
      completedAt: status === "DONE" ? new Date() : null,
      startedAt: status === "IN_PROGRESS" ? new Date() : undefined,
    },
  });

  // Update Job Order progress
  const job = await prisma.jobOrder.findUnique({
    where: { id: jobId },
    include: { tasks: true },
  });

  if (job) {
    const doneTasks = job.tasks.filter((t) => t.status === "DONE").length;
    const progress = (doneTasks / job.tasks.length) * 100;
    
    await prisma.jobOrder.update({
      where: { id: jobId },
      data: { 
        progress,
        wipPhase: phase,
      },
    });
  }

  revalidatePath(`/dashboard/${phase.toLowerCase()}`);
  revalidatePath("/dashboard/jobs");
}

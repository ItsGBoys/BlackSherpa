"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getUsers() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const division = formData.get("division") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      division,
    },
  });

  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as Role;
  const division = formData.get("division") as string;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      division,
    },
  });

  revalidatePath("/dashboard/users");
}

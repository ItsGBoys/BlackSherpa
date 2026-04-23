import { JobStatus, PrismaClient, Priority, Role, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ROUTING_PRODUK_A = [
  "PENGAMBILAN_BAHAN",
  "POTONG",
  "PRODUKSI",
  "QC",
  "SEAL",
  "PACKING",
  "DIKIRIM",
];

const WIP_MILESTONES = [
  { phase: "PENGAMBILAN_BAHAN", percentage: 10, notes: "Pengambilan Bahan (10%)" },
  { phase: "POTONG", percentage: 25, notes: "Potong selesai (25%)" },
  { phase: "PRODUKSI", percentage: 55, notes: "Produksi selesai (55%)" },
  { phase: "QC", percentage: 70, notes: "QC pass (70%)" },
  { phase: "SEAL", percentage: 85, notes: "Seal selesai (85%)" },
  { phase: "PACKING", percentage: 95, notes: "Packing selesai (95%)" },
  { phase: "DIKIRIM", percentage: 100, notes: "Dikirim (100%)" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const users: Array<{
    email: string;
    name: string;
    role: Role;
    division: string;
  }> = [
    {
      email: "superadmin@blacksherpa.id",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      division: "Super Admin",
    },
    {
      email: "admin.produksi@blacksherpa.id",
      name: "Admin Produksi",
      role: "ADMIN_PRODUKSI",
      division: "Admin Produksi",
    },
    {
      email: "gudang@blacksherpa.id",
      name: "PIC Gudang",
      role: "PIC_POTONG_GUDANG",
      division: "Gudang",
    },
    {
      email: "potong@blacksherpa.id",
      name: "PIC Potong",
      role: "PIC_POTONG_GUDANG",
      division: "PIC Potong",
    },
    {
      email: "produksi@blacksherpa.id",
      name: "PIC Produksi",
      role: "PIC_PRODUKSI",
      division: "PIC Produksi",
    },
    {
      email: "qc@blacksherpa.id",
      name: "PIC QC",
      role: "PIC_QC",
      division: "PIC QC",
    },
    {
      email: "seal@blacksherpa.id",
      name: "PIC Seal",
      role: "PIC_SEAL",
      division: "PIC Seal",
    },
    {
      email: "pengiriman@blacksherpa.id",
      name: "PIC Pengiriman",
      role: "PIC_PENGIRIMAN",
      division: "PIC Pengiriman",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
        division: user.division,
      },
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
        division: user.division,
      },
    });
  }

  const materials = [
    {
      key: "kain_utama",
      name: "Kain Utama Produk A",
      unit: "meter",
      stock: 45,
      minStock: 30,
      pricePerUnit: 95000,
    },
    {
      key: "lapisan_dalam",
      name: "Lapisan Dalam Produk A",
      unit: "meter",
      stock: 28,
      minStock: 20,
      pricePerUnit: 70000,
    },
    {
      key: "ritsleting",
      name: "Ritsleting Produk A",
      unit: "pcs",
      stock: 60,
      minStock: 40,
      pricePerUnit: 18000,
    },
    {
      key: "benang",
      name: "Benang Jahit Produk A",
      unit: "roll",
      stock: 12,
      minStock: 10,
      pricePerUnit: 25000,
    },
    {
      key: "kemasan",
      name: "Kemasan Produk A",
      unit: "pcs",
      stock: 40,
      minStock: 25,
      pricePerUnit: 5000,
    },
  ];

  const materialMap: Record<string, string> = {};
  for (const material of materials) {
    const seededMaterial = await prisma.material.upsert({
      where: { id: `mat-produk-a-${material.key}` },
      update: {
        name: material.name,
        unit: material.unit,
        stock: material.stock,
        minStock: material.minStock,
        pricePerUnit: material.pricePerUnit,
      },
      create: {
        id: `mat-produk-a-${material.key}`,
        name: material.name,
        unit: material.unit,
        stock: material.stock,
        minStock: material.minStock,
        pricePerUnit: material.pricePerUnit,
      },
    });
    materialMap[material.key] = seededMaterial.id;
  }

  const productA = await prisma.product.upsert({
    where: { sku: "PRODUK-A-001" },
    update: {
      name: "Produk A",
      category: "Manufaktur",
      routing: ROUTING_PRODUK_A,
    },
    create: {
      id: "prod-produk-a-001",
      name: "Produk A",
      sku: "PRODUK-A-001",
      category: "Manufaktur",
      routing: ROUTING_PRODUK_A,
    },
  });

  const bomItems = [
    { key: "kain_utama", qtyPerUnit: 2.5, unit: "meter" },
    { key: "lapisan_dalam", qtyPerUnit: 1.25, unit: "meter" },
    { key: "ritsleting", qtyPerUnit: 1, unit: "pcs" },
    { key: "benang", qtyPerUnit: 0.2, unit: "roll" },
    { key: "kemasan", qtyPerUnit: 1, unit: "pcs" },
  ];

  for (const item of bomItems) {
    await prisma.bOM.upsert({
      where: { id: `bom-produk-a-${item.key}` },
      update: {
        productId: productA.id,
        materialId: materialMap[item.key],
        qtyPerUnit: item.qtyPerUnit,
        unit: item.unit,
      },
      create: {
        id: `bom-produk-a-${item.key}`,
        productId: productA.id,
        materialId: materialMap[item.key],
        qtyPerUnit: item.qtyPerUnit,
        unit: item.unit,
      },
    });
  }

  const jobOrder = await prisma.jobOrder.upsert({
    where: { id: "jo-produk-a-routing" },
    update: {
      productId: productA.id,
      productName: productA.name,
      qty: 20,
      status: JobStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      progress: 10,
      wipPhase: "PENGAMBILAN_BAHAN",
    },
    create: {
      id: "jo-produk-a-routing",
      productId: productA.id,
      productName: productA.name,
      qty: 20,
      status: JobStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      progress: 10,
      wipPhase: "PENGAMBILAN_BAHAN",
    },
  });

  for (const milestone of WIP_MILESTONES) {
    await prisma.wIPLog.upsert({
      where: { id: `wip-produk-a-${milestone.phase.toLowerCase()}` },
      update: {
        jobId: jobOrder.id,
        phase: milestone.phase,
        percentage: milestone.percentage,
        notes: milestone.notes,
      },
      create: {
        id: `wip-produk-a-${milestone.phase.toLowerCase()}`,
        jobId: jobOrder.id,
        phase: milestone.phase,
        percentage: milestone.percentage,
        notes: milestone.notes,
      },
    });
  }

  const assigneeByPhase = {
    POTONG: "potong@blacksherpa.id",
    PRODUKSI: "produksi@blacksherpa.id",
    QC: "qc@blacksherpa.id",
    SEAL: "seal@blacksherpa.id",
    PACKING: "pengiriman@blacksherpa.id",
    DIKIRIM: "pengiriman@blacksherpa.id",
  };

  for (const milestone of WIP_MILESTONES) {
    const assigneeEmail = assigneeByPhase[milestone.phase] || "gudang@blacksherpa.id";
    const assignee = await prisma.user.findUnique({ where: { email: assigneeEmail } });

    await prisma.task.upsert({
      where: { id: `task-produk-a-${milestone.phase.toLowerCase()}` },
      update: {
        jobId: jobOrder.id,
        phase: milestone.phase,
        status: milestone.percentage <= 10 ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
        assignedTo: assignee?.id || null,
        notes: `Tahap ${milestone.phase} pada ${milestone.percentage}%`,
      },
      create: {
        id: `task-produk-a-${milestone.phase.toLowerCase()}`,
        jobId: jobOrder.id,
        phase: milestone.phase,
        status: milestone.percentage <= 10 ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
        assignedTo: assignee?.id || null,
        notes: `Tahap ${milestone.phase} pada ${milestone.percentage}%`,
      },
    });
  }

  console.log("Seed completed: user, produk, BOM, routing, dan WIP Produk A sudah siap.");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

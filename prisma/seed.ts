const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // 1. Super Admin
  await prisma.user.upsert({
    where: { email: "superadmin@blacksherpa.id" },
    update: {},
    create: {
      email: "superadmin@blacksherpa.id",
      name: "Andi Sherpa",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      division: "Management",
    },
  });

  // 2. Admin Produksi
  await prisma.user.upsert({
    where: { email: "admin.produksi@blacksherpa.id" },
    update: {},
    create: {
      email: "admin.produksi@blacksherpa.id",
      name: "Budi Produksi",
      password: hashedPassword,
      role: "ADMIN_PRODUKSI",
      division: "Planning",
    },
  });

  // 3. PIC Potong & Gudang
  await prisma.user.upsert({
    where: { email: "potong@blacksherpa.id" },
    update: {},
    create: {
      email: "potong@blacksherpa.id",
      name: "Citra Potong",
      password: hashedPassword,
      role: "PIC_POTONG_GUDANG",
      division: "Potong",
    },
  });

  // 4. PIC Produksi
  await prisma.user.upsert({
    where: { email: "produksi@blacksherpa.id" },
    update: {},
    create: {
      email: "produksi@blacksherpa.id",
      name: "Dewi Jahit",
      password: hashedPassword,
      role: "PIC_PRODUKSI",
      division: "Produksi",
    },
  });

  // 5. PIC QC
  await prisma.user.upsert({
    where: { email: "qc@blacksherpa.id" },
    update: {},
    create: {
      email: "qc@blacksherpa.id",
      name: "Eko Quality",
      password: hashedPassword,
      role: "PIC_QC",
      division: "QC",
    },
  });

  // 6. PIC Seal
  await prisma.user.upsert({
    where: { email: "seal@blacksherpa.id" },
    update: {},
    create: {
      email: "seal@blacksherpa.id",
      name: "Fajar Seal",
      password: hashedPassword,
      role: "PIC_SEAL",
      division: "Seal",
    },
  });

  // 7. PIC Pengiriman
  await prisma.user.upsert({
    where: { email: "pengiriman@blacksherpa.id" },
    update: {},
    create: {
      email: "pengiriman@blacksherpa.id",
      name: "Gita Kirim",
      password: hashedPassword,
      role: "PIC_PENGIRIMAN",
      division: "Pengiriman",
    },
  });

  // Seed some materials
  await prisma.material.createMany({
    data: [
      { name: "Ripstop Nylon 20D", unit: "meter", stock: 120, minStock: 50, pricePerUnit: 85000 },
      { name: "Silnylon 15D", unit: "meter", stock: 45, minStock: 30, pricePerUnit: 125000 },
      { name: "DAC Featherlite Pole", unit: "set", stock: 60, minStock: 25, pricePerUnit: 450000 },
      { name: "YKK zipper 5m", unit: "pcs", stock: 200, minStock: 100, pricePerUnit: 35000 },
      { name: "Dacron fabric", unit: "meter", stock: 80, minStock: 40, pricePerUnit: 95000 },
    ],
    skipDuplicates: true,
  });

  // Seed some products
  const existingProduct = await prisma.product.findUnique({ where: { sku: "BS-TUL2P-S" } });
  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: "Tenda Ultralight 2P Saphire",
        sku: "BS-TUL2P-S",
        category: "Tenda",
        routing: ["POTONG", "PRODUKSI", "QC", "SEAL", "SHIPPING"],
        bom: {
          create: [
            { materialId: (await prisma.material.findFirst({ where: { name: "Ripstop Nylon 20D" } }))?.id || "", qtyPerUnit: 4, unit: "meter" },
            { materialId: (await prisma.material.findFirst({ where: { name: "DAC Featherlite Pole" } }))?.id || "", qtyPerUnit: 2, unit: "set" },
          ],
        },
      },
    });
  }

  console.log("✅ Seed completed! All 7 division accounts created.");
  console.log("");
  console.log("📋 ACCOUNT CREDENTIALS:");
  console.log("=".repeat(50));
  console.log("1. SUPER_ADMIN      | superadmin@blacksherpa.id    | admin123");
  console.log("2. ADMIN_PRODUKSI   | admin.produksi@blacksherpa.id | admin123");
  console.log("3. PIC_POTONG_GUDANG| potong@blacksherpa.id        | admin123");
  console.log("4. PIC_PRODUKSI     | produksi@blacksherpa.id      | admin123");
  console.log("5. PIC_QC           | qc@blacksherpa.id            | admin123");
  console.log("6. PIC_SEAL         | seal@blacksherpa.id          | admin123");
  console.log("7. PIC_PENGIRIMAN   | pengiriman@blacksherpa.id    | admin123");
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

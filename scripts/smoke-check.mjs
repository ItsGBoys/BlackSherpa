import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const emails = [
    "superadmin@blacksherpa.id",
    "admin.produksi@blacksherpa.id",
    "gudang@blacksherpa.id",
    "potong@blacksherpa.id",
    "produksi@blacksherpa.id",
    "qc@blacksherpa.id",
    "seal@blacksherpa.id",
    "pengiriman@blacksherpa.id",
  ];

  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: { email: true, password: true, role: true },
  });

  const credentialChecks = await Promise.all(
    users.map(async (user) => ({
      email: user.email,
      role: user.role,
      passwordOk: user.password ? await bcrypt.compare("admin123", user.password) : false,
    }))
  );

  const dbPing = await prisma.$queryRawUnsafe("SELECT 1 as ok");
  const product = await prisma.product.findUnique({
    where: { sku: "PRODUK-A-001" },
    include: { bom: true },
  });
  const job = await prisma.jobOrder.findUnique({
    where: { id: "jo-produk-a-routing" },
    include: { tasks: true, wipLogs: true },
  });

  console.log(
    JSON.stringify(
      {
        dbPing,
        usersFound: users.length,
        credentialChecks,
        productFound: Boolean(product),
        bomCount: product?.bom.length ?? 0,
        jobFound: Boolean(job),
        taskCount: job?.tasks.length ?? 0,
        wipLogCount: job?.wipLogs.length ?? 0,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StatsCard from "@/components/dashboard/StatsCard";
import ProductionProgress from "@/components/dashboard/ProductionProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ClientMotionDiv from "@/components/ClientMotionDiv";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const activeJobs = await prisma.jobOrder.findMany({
    where: { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
    orderBy: { updatedAt: "desc" },
    take: 4,
  });
  const materials = await prisma.material.findMany({
    select: { stock: true, minStock: true },
  });
  const lowStockCount = materials.filter((material) => material.stock <= material.minStock).length;

  return (
    <div className="space-y-8">
      <ClientMotionDiv>
        <h1 className="text-3xl font-heading font-bold">
          Selamat Datang, <span className="text-gradient-mint">{user.name}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isSuperAdmin ? "Executive Control Center" : "Ringkasan Operasional"} · {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </ClientMotionDiv>

      {/* Role-Specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isSuperAdmin ? (
          <>
            <StatsCard title="Revenue Forecast" value="Rp 450M" icon="DOLLAR_SIGN" variant="mint" trend={{ value: 12, positive: true }} delay={0} />
            <StatsCard title="Total Users" value={24} icon="USERS" variant="default" subtitle="6 Divisi Aktif" delay={0.1} />
            <StatsCard title="Global Efficiency" value="94.2%" icon="TRENDING_UP" variant="mint" trend={{ value: 2.1, positive: true }} delay={0.2} />
            <StatsCard title="Stock Alerts" value={lowStockCount} icon="ALERT_TRIANGLE" variant="orange" subtitle="Perlu Restock" delay={0.3} />
          </>
        ) : (
          <>
            <StatsCard title="Job Order Aktif" value={activeJobs.length} icon="CLIPBOARD_LIST" variant="mint" trend={{ value: 8, positive: true }} delay={0} />
            <StatsCard title="Unit Produksi" value={255} icon="FACTORY" variant="default" subtitle="4 batch berjalan" delay={0.1} />
            <StatsCard title="QC Pass Rate" value="96.5%" icon="SHIELD_CHECK" variant="mint" trend={{ value: 2.1, positive: true }} delay={0.2} />
            <StatsCard title="Deadline Hari Ini" value={5} icon="TRUCK" variant="orange" subtitle="3 Segera Dikirim" delay={0.3} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionProgress jobs={activeJobs} />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="WIP Aging" value="3.2 Hari" icon="FACTORY" variant="default" subtitle="Rata-rata per batch" delay={0.4} />
          <StatsCard title="Material Cost" value="Rp 120M" icon="DATABASE" variant="default" subtitle="Bulan ini" delay={0.5} />
          <StatsCard title="On-Time Delivery" value="98.1%" icon="TRUCK" variant="mint" trend={{ value: 0.5, positive: true }} delay={0.6} />
        </div>
      )}
    </div>
  );
}

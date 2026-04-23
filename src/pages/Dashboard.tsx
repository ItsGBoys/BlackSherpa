import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import ProductionProgress from "@/components/dashboard/ProductionProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CuttingPage from "@/pages/divisions/CuttingPage";
import ProductionPage from "@/pages/divisions/ProductionPage";
import QCPage from "@/pages/divisions/QCPage";
import SealPage from "@/pages/divisions/SealPage";
import ShippingPage from "@/pages/divisions/ShippingPage";
import WarehousePage from "@/pages/divisions/WarehousePage";
import JobOrdersPage from "@/pages/JobOrdersPage";
import GanttChart from "@/pages/GanttChart";
import ProductsPage from "@/pages/ProductsPage";
import UsersPage from "@/pages/UsersPage";
import { ClipboardList, Factory, ShieldCheck, AlertTriangle, Truck, Package } from "lucide-react";

const DashboardHome = () => {
  const { user } = useAuth();
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-heading font-bold">
          Selamat Datang, <span className="text-gradient-mint">{user?.name || "Admin"}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan produksi · {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Job Order Aktif" value={12} icon={ClipboardList} variant="mint" trend={{ value: 8, positive: true }} delay={0} />
        <StatsCard title="Unit Dalam Produksi" value={255} icon={Factory} variant="default" subtitle="4 batch berjalan" delay={0.1} />
        <StatsCard title="QC Pass Rate" value="96.5%" icon={ShieldCheck} variant="mint" trend={{ value: 2.1, positive: true }} delay={0.2} />
        <StatsCard title="Low Stock Alerts" value={3} icon={AlertTriangle} variant="orange" subtitle="Perlu restock" delay={0.3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><ProductionProgress /></div>
        <div><RecentActivity /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatsCard title="Pengiriman Hari Ini" value={5} icon={Truck} variant="default" subtitle="3 sudah dikirim" delay={0.4} />
        <StatsCard title="Total Produk" value={24} icon={Package} variant="default" subtitle="6 kategori" delay={0.5} />
        <StatsCard title="Efisiensi Bahan" value="94.2%" icon={Factory} variant="mint" trend={{ value: 1.5, positive: true }} delay={0.6} />
      </div>
    </div>
  );
};

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <p className="text-2xl font-heading font-bold text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex fabric-texture">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="jobs" element={<JobOrdersPage />} />
          <Route path="schedule" element={<GanttChart />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="materials" element={<WarehousePage />} />
          <Route path="cutting" element={<CuttingPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="qc" element={<QCPage />} />
          <Route path="seal" element={<SealPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="reports" element={<ComingSoon title="Laporan Produksi" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<ComingSoon title="Pengaturan" />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <p className="text-2xl font-heading font-bold text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex fabric-texture">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="jobs" element={<JobOrdersPage />} />
          <Route path="schedule" element={<GanttChart />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="materials" element={<WarehousePage />} />
          <Route path="cutting" element={<CuttingPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="qc" element={<QCPage />} />
          <Route path="seal" element={<SealPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="reports" element={<ComingSoon title="Laporan Produksi" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<ComingSoon title="Pengaturan" />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import TentIcon from "@/components/TentIcon";
import { useAuth, ROLE_LABELS, ROLE_COLORS } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, ClipboardList, Scissors, Factory,
  ShieldCheck, Stamp, Truck, Warehouse, BarChart3, Settings,
  ChevronLeft, ChevronRight, Users, Database, Calendar, LogOut
} from "lucide-react";

const allNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Job Orders", icon: ClipboardList, path: "/dashboard/jobs" },
  { label: "Penjadwalan", icon: Calendar, path: "/dashboard/schedule" },
  { label: "Master Produk", icon: Package, path: "/dashboard/products" },
  { label: "Bahan Baku", icon: Database, path: "/dashboard/materials" },
  { label: "Potong", icon: Scissors, path: "/dashboard/cutting" },
  { label: "Produksi", icon: Factory, path: "/dashboard/production" },
  { label: "Quality Control", icon: ShieldCheck, path: "/dashboard/qc" },
  { label: "Seal & Packing", icon: Stamp, path: "/dashboard/seal" },
  { label: "Pengiriman", icon: Truck, path: "/dashboard/shipping" },
  { label: "Gudang", icon: Warehouse, path: "/dashboard/warehouse" },
  { label: "Laporan", icon: BarChart3, path: "/dashboard/reports" },
  { label: "User & Roles", icon: Users, path: "/dashboard/users" },
  { label: "Pengaturan", icon: Settings, path: "/dashboard/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasAccess } = useAuth();

  const navItems = allNavItems.filter((item) => hasAccess(item.path));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-sidebar fabric-texture"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <TentIcon size={32} />
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">
              <span className="font-heading font-bold text-sm text-gradient-mint">Black Sherpa</span>
              <span className="block text-[10px] text-muted-foreground tracking-widest uppercase">MFG OS</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Info */}
      {user && !collapsed && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <RouterNavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative ${
                isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap font-medium">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-0.5 h-6 bg-primary rounded-r" />}
            </RouterNavLink>
          );
        })}
      </nav>

      {/* Logout + Toggle */}
      <div className="border-t border-border">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut size={18} />
          {!collapsed && <span className="font-medium">Keluar</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center w-full h-10 text-muted-foreground hover:text-foreground transition-colors border-t border-border">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;

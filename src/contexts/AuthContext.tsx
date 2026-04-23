import { createContext, useContext, useState, ReactNode } from "react";

export type Role =
  | "super_admin"
  | "admin_produksi"
  | "pic_potong"
  | "produksi"
  | "qc"
  | "seal"
  | "pengiriman"
  | "gudang";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin_produksi: "Admin Produksi",
  pic_potong: "PIC Potong",
  produksi: "Produksi",
  qc: "Quality Control",
  seal: "Seal & Packing",
  pengiriman: "Pengiriman",
  gudang: "Gudang",
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: "bg-primary text-primary-foreground",
  admin_produksi: "bg-secondary text-secondary-foreground",
  pic_potong: "bg-blue-600 text-foreground",
  produksi: "bg-emerald-600 text-foreground",
  qc: "bg-violet-600 text-foreground",
  seal: "bg-amber-600 text-foreground",
  pengiriman: "bg-cyan-600 text-foreground",
  gudang: "bg-rose-600 text-foreground",
};

export const MOCK_USERS: (User & { password: string })[] = [
  { id: "u1", name: "Andi Sherpa", email: "superadmin@blacksherpa.id", password: "admin123", role: "super_admin" },
  { id: "u2", name: "Budi Produksi", email: "admin.produksi@blacksherpa.id", password: "admin123", role: "admin_produksi" },
  { id: "u3", name: "Citra Potong", email: "potong@blacksherpa.id", password: "admin123", role: "pic_potong" },
  { id: "u4", name: "Dedi Jahit", email: "produksi@blacksherpa.id", password: "admin123", role: "produksi" },
  { id: "u5", name: "Eka Quality", email: "qc@blacksherpa.id", password: "admin123", role: "qc" },
  { id: "u6", name: "Fani Seal", email: "seal@blacksherpa.id", password: "admin123", role: "seal" },
  { id: "u7", name: "Gilang Kirim", email: "pengiriman@blacksherpa.id", password: "admin123", role: "pengiriman" },
  { id: "u8", name: "Hana Gudang", email: "gudang@blacksherpa.id", password: "admin123", role: "gudang" },
];

// Role-based menu access
export const ROLE_MENU_ACCESS: Record<Role, string[]> = {
  super_admin: ["all"],
  admin_produksi: [
    "/dashboard",
    "/dashboard/jobs",
    "/dashboard/schedule",
    "/dashboard/cutting",
    "/dashboard/production",
    "/dashboard/qc",
    "/dashboard/seal",
    "/dashboard/shipping",
    "/dashboard/warehouse",
    "/dashboard/reports"
  ],
  pic_potong: ["/dashboard", "/dashboard/cutting", "/dashboard/warehouse"],
  produksi: ["/dashboard", "/dashboard/production"],
  qc: ["/dashboard", "/dashboard/qc"],
  seal: ["/dashboard", "/dashboard/seal"],
  pengiriman: ["/dashboard", "/dashboard/shipping"],
  gudang: ["/dashboard", "/dashboard/warehouse", "/dashboard/materials"],
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const hasAccess = (path: string): boolean => {
    if (!user) return false;
    const access = ROLE_MENU_ACCESS[user.role];
    if (access.includes("all")) return true;
    return access.some((p) => path === p || path.startsWith(p + "/"));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

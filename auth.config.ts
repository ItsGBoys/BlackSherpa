import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const role = auth?.user?.role;

      if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      const path = nextUrl.pathname;
      const roleAccessRules: Array<{ prefix: string; allowedRoles: string[] }> = [
        { prefix: "/dashboard/users", allowedRoles: ["SUPER_ADMIN"] },
        { prefix: "/dashboard/settings", allowedRoles: ["SUPER_ADMIN"] },
        { prefix: "/dashboard/products", allowedRoles: ["SUPER_ADMIN"] },
        { prefix: "/dashboard/jobs", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI"] },
        { prefix: "/dashboard/schedule", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI"] },
        { prefix: "/dashboard/reports", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI"] },
        { prefix: "/dashboard/warehouse", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_POTONG_GUDANG"] },
        { prefix: "/dashboard/cutting", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_POTONG_GUDANG"] },
        { prefix: "/dashboard/production", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_PRODUKSI"] },
        { prefix: "/dashboard/qc", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_QC"] },
        { prefix: "/dashboard/seal", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_SEAL"] },
        { prefix: "/dashboard/shipping", allowedRoles: ["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_PENGIRIMAN"] },
      ];

      const rule = roleAccessRules.find((item) => path.startsWith(item.prefix));
      if (rule && role && !rule.allowedRoles.includes(role)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isUsersPage = nextUrl.pathname.startsWith("/dashboard/users");

      if (isUsersPage && auth?.user?.role !== "SUPER_ADMIN") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      if (isDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

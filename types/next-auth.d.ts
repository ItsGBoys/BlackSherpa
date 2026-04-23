import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
      division?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    division?: string | null;
  }
}

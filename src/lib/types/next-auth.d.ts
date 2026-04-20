import type { AuthUser, UserRole } from "./auth";

type SessionUser = Omit<AuthUser, "accessToken">;

declare module "next-auth" {
  interface User {
    first_name: string;
    last_name: string;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    accessToken: string;
  }

  interface Session {
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthUser;
  }
}

import type { SessionUser } from "./auth";

declare module "next-auth" {
  interface User {
    id: string;
    accessToken: string;
    user: SessionUser;
  }

  interface Session {
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      accessToken: string;
      user: SessionUser;
    };
  }
}

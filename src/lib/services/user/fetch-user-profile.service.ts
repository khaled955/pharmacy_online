import { authOptions } from "@/next-auth";
import type { AuthUser } from "@/lib/types/auth";
import { getServerSession } from "next-auth/next";

export const fetchUserProfileService = async (): Promise<Omit<AuthUser, "accessToken"> | null> => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};

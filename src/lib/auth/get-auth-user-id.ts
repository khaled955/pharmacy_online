import "server-only";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/next-auth";

export async function getAuthUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

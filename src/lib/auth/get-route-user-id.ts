import "server-only";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function getRouteUserId(req: NextRequest): Promise<string | null> {
  const token = await getToken({ req });
  return token?.user?.id ?? null;
}

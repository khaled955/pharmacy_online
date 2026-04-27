import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/next-auth";
import type { AuthUser } from "@/lib/types/auth";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export const metadata = { title: "Admin Dashboard | MedBox" };

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as AuthUser | undefined;

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminDashboard />;
}

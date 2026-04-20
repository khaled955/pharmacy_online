import type { UserRole } from "@/lib/types/auth";

const policies: Record<UserRole, string[]> = {
  admin: ["view:dashboard", "view:publicPages"],
  customer: ["view:publicPages"],
};

export function hasPermission(permission: string, role?: UserRole) {
  if (!role) return false;
  return policies[role]?.includes(permission) ?? false;
}

import type { UserRole } from "@/lib/types/auth";

const POLICIES = {
  admin: [
    "view:dashboard",
    "view:products",
    "create:products",
    "update:products",
    "delete:products",
    "view:categories",
    "create:categories",
    "update:categories",
    "delete:categories",
  ],
  customer: ["view:products", "view:categories"],
} as const;

type Permission = (typeof POLICIES)[keyof typeof POLICIES][number];

export function hasPermission(permission: Permission, role?: UserRole) {
  if (!role) return false;

  return (POLICIES[role] as readonly Permission[]).includes(permission);
}

import type { Session } from "next-auth";
import type { ProductRow as Product } from "../types/product";
import type { UserRole } from "../types/auth";

type Review = {
  id: string;
  userId: string;
};

type Permissions = {
  products: {
    type: Product;
    action: "view" | "create" | "update" | "delete";
  };
  reviews: {
    type: Review;
    action: "view" | "create" | "update" | "delete";
  };
};

type Policies = {
  [R in UserRole]: Partial<{
    [P in keyof Permissions]: Partial<{
      [A in Permissions[P]["action"]]:
        | boolean
        | ((
            user: Session["user"],
            resource?: Permissions[P]["type"],
          ) => boolean);
    }>;
  }>;
};

const POLICIES: Policies = {
  admin: {
    products: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    reviews: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  customer: {
    products: {
      view: true,
    },
    reviews: {
      view: true,
      create: true,
      update: (user, review) => user.id === review?.userId,
      delete: (user, review) => user.id === review?.userId,
    },
  },
} as const;

export function hasPermission<Object extends keyof Permissions>(
  subject: Session["user"] | null | undefined,
  object: Object,
  action: Permissions[Object]["action"],
  resource?: Permissions[Object]["type"],
) {
  if (!subject) return false;

  const permission = POLICIES[subject.role][object]?.[action];

  if (typeof permission === "function") {
    return permission(subject, resource);
  }

  if (typeof permission === "boolean") {
    return permission;
  }

  return false;
}

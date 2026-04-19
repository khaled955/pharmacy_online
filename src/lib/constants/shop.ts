// ─── DB Table names ──────────────────────────────────────────────────────────

export const SHOP_TABLES = {
  CART: "cart_items",
  WISHLIST: "wishlist_items",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
  ADDRESSES: "addresses",
} as const;

// ─── TanStack Query keys ─────────────────────────────────────────────────────

export const QUERY_KEYS = {
  CART: ["cart"] as const,
  CART_COUNT: ["cart-count"] as const,
  WISHLIST: ["wishlist"] as const,
  WISHLIST_COUNT: ["wishlist-count"] as const,
  ORDERS: ["orders"] as const,
  ORDER: (orderId: string) => ["order", orderId] as const,
  ADDRESSES: ["addresses"] as const,
} as const;

export const SHOP_MUTATION_KEYS = {
  ADD_TO_CART: ["cart", "add"] as const,
  UPDATE_CART_ITEM: ["cart", "update"] as const,
  REMOVE_FROM_CART: ["cart", "remove"] as const,
  CLEAR_CART: ["cart", "clear"] as const,
  ADD_TO_WISHLIST: ["wishlist", "add"] as const,
  REMOVE_FROM_WISHLIST: ["wishlist", "remove"] as const,
  CREATE_ORDER: ["orders", "create"] as const,
  SAVE_ADDRESS: ["addresses", "save"] as const,
  DELETE_ADDRESS: ["addresses", "delete"] as const,
} as const;

// ─── Shipping ────────────────────────────────────────────────────────────────

export const SHIPPING_FEE = 15;
export const FREE_SHIPPING_THRESHOLD = 200;

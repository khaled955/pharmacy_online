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
  // Admin dashboard
  ADMIN_STATS: ["admin", "stats"] as const,
  DAILY_REVENUE: ["admin", "revenue", "daily"] as const,
  MONTHLY_REVENUE: ["admin", "revenue", "monthly"] as const,
  TOP_PRODUCTS: ["admin", "top-products"] as const,
  RECENT_ORDERS: ["admin", "orders", "recent"] as const,
  PENDING_ORDERS: ["admin", "orders", "pending"] as const,
  PROCESSING_ORDERS: ["admin", "orders", "confirmed"] as const,
  ADMIN_ORDER: (orderId: string) => ["admin", "order", orderId] as const,
} as const;

export const SHOP_MUTATION_KEYS = {
  ADD_TO_CART: ["cart", "add"] as const,
  UPDATE_CART_ITEM: ["cart", "update"] as const,
  REMOVE_FROM_CART: ["cart", "remove"] as const,
  CLEAR_CART: ["cart", "clear"] as const,
  ADD_TO_WISHLIST: ["wishlist", "add"] as const,
  REMOVE_FROM_WISHLIST: ["wishlist", "remove"] as const,
  CREATE_ORDER: ["orders", "create"] as const,
  UPDATE_ORDER_STATUS: ["orders", "update-status"] as const,
  SAVE_ADDRESS: ["addresses", "save"] as const,
  DELETE_ADDRESS: ["addresses", "delete"] as const,
  MARK_NOTIFICATION_READ: ["notifications", "mark-read"] as const,
  MARK_ALL_NOTIFICATIONS_READ: ["notifications", "mark-all-read"] as const,
} as const;

// ─── Shipping ────────────────────────────────────────────────────────────────

export const SHIPPING_FEE = 15;
export const FREE_SHIPPING_THRESHOLD = 200;

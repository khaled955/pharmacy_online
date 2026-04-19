export type ProductRow = {
  id: string;
  code: string | null;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  image_url: string | null;
  images: string[] | null;
  category_id: string | null;
  is_active: boolean;
  is_on_promotion: boolean;
  promotion_label_en: string | null;
  promotion_label_ar: string | null;
  avg_rating: number | null;
  reviews_count: number | null;
  brand: string | null;
  prescription_type: string | null;
  sku: string | null;
  requires_prescription: boolean;
  active_ingredient: string | null;
  dosage_form: string | null;
  strength: string | null;
  manufacturer: string | null;
  usage_instructions: string | null;
  warnings: string | null;
  ingredients: string | null;
  size_label: string | null;
  is_best_seller: boolean;
  is_trending: boolean;
  seasonal_tag: string | null;
  sold_count: number;
  view_count: number;
  wishlist_count: number;
  display_priority: number;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  icon: string | null;
  is_active: boolean;
};

export type ReviewRow = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type ProductCardData = Pick<
  ProductRow,
  | "id"
  | "slug"
  | "name_en"
  | "name_ar"
  | "price"
  | "original_price"
  | "stock"
  | "image_url"
  | "avg_rating"
  | "reviews_count"
  | "brand"
  | "is_on_promotion"
  | "promotion_label_en"
  | "is_best_seller"
>;

export type ProductDetailsData = ProductRow & {
  category: CategoryRow | null;
};

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "sold_desc"
  | "trending_desc";

export type ProductFilters = {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  prescriptionType?: string;
  seasonalTag?: string;
  bestSeller?: boolean;
  trending?: boolean;
  q?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
};

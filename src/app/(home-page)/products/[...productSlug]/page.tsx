import { notFound } from "next/navigation";
import { ChevronRight, ShoppingCart, Share2, Check, Package, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/shared/product-card";
import { ProductImageGallery } from "@/components/shared/product-image-gallery";
import { ProductTabs } from "@/components/shared/product-tabs";
import { getProductBySlug } from "@/lib/services/products/get-product-by-slug.service";
import { getRelatedProducts } from "@/lib/services/products/get-related-products.service";
import { getProductReviews } from "@/lib/services/reviews/get-product-reviews.service";
import { toProductCardProps } from "@/lib/utils/product-mapper";

/* ─── Guarantee bar ─────────────────────────────────────────── */
const GUARANTEES = [
  { icon: Package,     label: "Free packaging" },
  { icon: Truck,       label: "Fast delivery" },
  { icon: ShieldCheck, label: "Authentic products" },
  { icon: RotateCcw,   label: "Easy returns" },
];

function GuaranteeBar() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {GUARANTEES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-2.5"
        >
          <Icon className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default async function ProductDetailsPage(
  props: PageProps<`/products/[...productSlug]`>,
) {
  const productSlug = (await props.params).productSlug.join("/");

  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  const [realReviews, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts({
      productId: product.id,
      categoryId: product.category_id,
      brand: product.brand,
      seasonalTag: product.seasonal_tag,
      limit: 4,
    }),
  ]);

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) * 100,
        )
      : null;

  const specs = [
    { label: "Brand",              value: product.brand },
    { label: "Active Ingredient",  value: product.active_ingredient },
    { label: "Dosage Form",        value: product.dosage_form },
    { label: "Strength",           value: product.strength },
    { label: "Manufacturer",       value: product.manufacturer },
    { label: "SKU",                value: product.sku },
    { label: "Size",               value: product.size_label },
    { label: "Prescription Type",  value: product.prescription_type },
  ];

  const categoryName = product.category?.name_en ?? null;

  return (
    <div className="section-container py-8">
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {["Home", "Shop", categoryName ?? "Products", product.name_en].map(
          (crumb, i, arr) => (
            <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
              <span
                className={
                  i < arr.length - 1
                    ? "hover:text-primary cursor-pointer transition-colors"
                    : "text-foreground font-medium truncate max-w-40"
                }
              >
                {crumb}
              </span>
              {i < arr.length - 1 && (
                <ChevronRight className="h-3 w-3 shrink-0" />
              )}
            </span>
          ),
        )}
      </nav>

      {/* ── Main product section ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[420px_1fr]">

        {/* ── Left: image gallery (client component) ── */}
        <ProductImageGallery
          imageUrl={product.image_url}
          images={product.images}
          productName={product.name_en}
          discountPercent={discountPercent}
        />

        {/* ── Right: product info ── */}
        <div className="space-y-4">
          {/* Brand + share */}
          <div className="flex items-center justify-between">
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {product.brand}
              </span>
            )}
            <button
              type="button"
              aria-label="Share"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full ms-auto",
                "border border-border bg-card text-muted-foreground",
                "hover:border-primary/30 hover:text-primary transition-colors",
              )}
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
            {product.name_en}
          </h1>

          {/* Rating */}
          {product.avg_rating !== null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">
                {product.avg_rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({(product.reviews_count ?? 0).toLocaleString()} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
            {discountPercent && (
              <Badge variant="sale" className="text-sm">
                Save {discountPercent}%
              </Badge>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                product.stock > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-destructive",
              )}
            >
              <Check className="h-4 w-4" />
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.stock > 0 && product.stock < 200 && (
              <span className="text-xs text-muted-foreground">
                ({product.stock} units left)
              </span>
            )}
          </div>

          {/* Prescription badge */}
          {product.requires_prescription && (
            <Badge variant="warning" className="w-fit">
              Prescription Required
            </Badge>
          )}

          <Separator />

          {/* Quantity + CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card">
              <button
                type="button"
                className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-foreground">
                1
              </span>
              <button
                type="button"
                className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>

            <Button
              className="flex-1 bg-gradient-brand hover:opacity-90"
              size="lg"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          <GuaranteeBar />
        </div>
      </div>

      {/* ── Tabs: Description, Reviews, Specs ── */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <ProductTabs
          description={product.description_en}
          usageInstructions={product.usage_instructions}
          warnings={product.warnings}
          ingredients={product.ingredients}
          reviews={realReviews}
          reviewCount={product.reviews_count}
          avgRating={product.avg_rating}
          specs={specs}
        />

        {/* Sidebar: related products mini-list */}
        {related.length > 0 && (
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="mb-4 text-sm font-bold text-foreground">
                Related Products
              </h3>
              <div className="space-y-3">
                {related.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-2.5"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-lg bg-muted overflow-hidden">
                      {rel.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rel.image_url}
                          alt={rel.name_en}
                          className="h-full w-full object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {rel.name_en}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-primary">
                        ${rel.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Related Products grid ── */}
      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeader
            title="Related Products"
            viewAllHref="/products"
            viewAllLabel="View All"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {related.map((rel) => (
              <ProductCard key={rel.id} {...toProductCardProps(rel)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

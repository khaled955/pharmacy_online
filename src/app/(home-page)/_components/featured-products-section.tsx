import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getBestSellers } from "@/lib/services/products/get-best-sellers.service";
import { getTrendingProducts } from "@/lib/services/products/get-trending-products.service";
import { toProductCardProps } from "@/lib/utils/product-mapper";

async function BestSellersSection() {
  const products = await getBestSellers(5);

  return (
    <section className="section-container py-8">
      <SectionHeader
        title="Best Sellers"
        description="Most trusted products by our customers"
        viewAllHref="/products?sort=sold_desc&bestSeller=true"
        viewAllLabel="View All"
      />
      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} {...toProductCardProps(product)} />
          ))}
        </div>
      )}
    </section>
  );
}

async function TrendingSection() {
  const products = await getTrendingProducts(4);

  return (
    <section className="section-container py-8">
      <SectionHeader
        title="Trending Now"
        description="Products everyone is talking about"
        viewAllHref="/products?sort=trending_desc"
        viewAllLabel="View All"
      />
      {products.length === 0 ? (
        <EmptyState title="No trending products" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...toProductCardProps(product)} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function FeaturedProductsSection() {
  return (
    <>
      <BestSellersSection />
      <TrendingSection />
    </>
  );
}

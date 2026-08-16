import { Sparkles } from "lucide-react";
import { getProducts } from "@/lib/api/catalog";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Reveal from "./Reveal";

export default async function FeaturedProductsGrid() {
  let products = [];
  let hasError = false;

  try {
    const data = await getProducts();
    const all = Array.isArray(data?.products) ? data.products : [];
    products = all.filter((product) => product.featured);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load featured products right now." />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No featured products yet"
        description="Check back soon for handpicked picks."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <Reveal key={product._id} delay={Math.min(index * 0.05, 0.3)}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

import { PackageSearch } from "lucide-react";
import { getProducts } from "@/lib/api/catalog";
import ProductCard from "@/components/home/ProductCard";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import Reveal from "@/components/home/Reveal";

export default async function RelatedProducts({ categoryId, excludeId }) {
  if (!categoryId) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No related products"
        description="This product isn't linked to a category yet."
      />
    );
  }

  let products = [];
  let hasError = false;

  try {
    const data = await getProducts({ category: categoryId });
    const list = Array.isArray(data?.products) ? data.products : [];
    products = list.filter((product) => product._id !== excludeId).slice(0, 4);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load related products right now." />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No related products"
        description="Check back soon for more in this category."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <Reveal key={product._id} delay={Math.min(index * 0.05, 0.2)}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

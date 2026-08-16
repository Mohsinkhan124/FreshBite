import { PackageSearch } from "lucide-react";
import { getProducts } from "@/lib/api/catalog";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Reveal from "./Reveal";

export default async function LatestProductsGrid() {
  let products = [];
  let hasError = false;

  try {
    const data = await getProducts();
    const all = Array.isArray(data?.products) ? data.products : [];
    products = [...all]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load the latest products right now." />;
  }

  if (products.length === 0) {
    return <EmptyState icon={PackageSearch} title="No products yet" description="New arrivals will show up here." />;
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

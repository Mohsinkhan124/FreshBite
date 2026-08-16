import { PackageSearch } from "lucide-react";
import { getProducts } from "@/lib/api/catalog";
import { filtersToApiParams, sortProducts } from "@/lib/products/query";
import ProductCard from "@/components/home/ProductCard";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import Reveal from "@/components/home/Reveal";
import Pagination from "./Pagination";

/**
 * Fetches GET /products with the exact query params the backend
 * supports (page, search, category, featured, minPrice, maxPrice,
 * sort), then applies a defensive client-side sort so ordering is
 * correct even if the backend doesn't honor `sort` yet. Filtering and
 * pagination are trusted to the backend as instructed.
 */
export default async function ProductsResults({ filters }) {
  let products = [];
  let pagination = { page: filters.page, totalPages: 1, totalProducts: 0 };
  let hasError = false;

  try {
    const data = await getProducts(filtersToApiParams(filters));
    const list = Array.isArray(data?.products) ? data.products : [];
    products = sortProducts(list, filters.sort);
    pagination = {
      page: Number(data?.page) || filters.page,
      totalPages: Number(data?.totalPages) || 1,
      totalProducts: Number(data?.totalProducts ?? list.length),
    };
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load products right now." />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting or resetting your filters."
      />
    );
  }

  return (
    <div>
      <p className="mb-5 text-sm text-ink-500">
        {pagination.totalProducts} product{pagination.totalProducts === 1 ? "" : "s"} found
      </p>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product._id} delay={Math.min(index * 0.04, 0.24)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} filters={filters} />
    </div>
  );
}

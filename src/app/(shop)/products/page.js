import { Suspense } from "react";
import { getCategories } from "@/lib/api/catalog";
import { parseProductFilters } from "@/lib/products/query";
import { PAGINATION } from "@/constants/config";
import Breadcrumb from "@/components/common/Breadcrumb";
import FiltersSidebar from "@/components/products/FiltersSidebar";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import ActiveFilterChips from "@/components/products/ActiveFilterChips";
import ProductsResults from "@/components/products/ProductsResults";
import ProductGridSkeleton from "@/components/home/ProductGridSkeleton";

export const metadata = { title: "Products" };

// Filters/search/sort/pagination all depend on the query string, so
// this route always renders per-request rather than being prerendered.
export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }) {
  const rawParams = await searchParams;
  const filters = parseProductFilters(rawParams);

  const categoriesData = await getCategories().catch(() => null);
  const categories = Array.isArray(categoriesData?.categories) ? categoriesData.categories : [];

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.featured ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Products" }]} />

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">All products</h1>
        <p className="mt-2 text-sm text-ink-500">Fresh groceries and pantry staples, ready to deliver.</p>
      </div>

      <ActiveFilterChips filters={filters} categories={categories} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <FiltersSidebar categories={categories} filters={filters} />

        <div>
          <ProductsToolbar filters={filters} categories={categories} activeFilterCount={activeFilterCount} />

          <div className="mt-6">
            <Suspense key={JSON.stringify(filters)} fallback={<ProductGridSkeleton count={PAGINATION.defaultLimit} />}>
              <ProductsResults filters={filters} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

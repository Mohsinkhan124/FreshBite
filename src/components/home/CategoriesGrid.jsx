import { LayoutGrid } from "lucide-react";
import { getCategories } from "@/lib/api/catalog";
import CategoryCard from "./CategoryCard";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

/**
 * Async Server Component — fetches GET /categories directly. Rendered
 * inside a <Suspense> boundary from CategoriesSection so the page can
 * stream this in behind a skeleton instead of blocking the whole route.
 */
export default async function CategoriesGrid() {
  let categories = [];
  let hasError = false;

  try {
    const data = await getCategories();
    categories = Array.isArray(data?.categories) ? data.categories : [];
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load categories right now." />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No categories yet"
        description="Check back soon — new categories are on the way."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  );
}

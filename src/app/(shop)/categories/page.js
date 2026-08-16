import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { getCategories } from "@/lib/api/catalog";
import Reveal from "@/components/home/Reveal";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import CategoriesSkeleton from "@/components/home/CategoriesSkeleton";
import ImageWithFallback from "@/components/home/ImageWithFallback";

export const metadata = {
  title: "Categories",
  description:
    "Browse every FreshBite category — fresh produce, pantry staples and daily essentials, all in one place.",
};

// Category list changes over time, so this renders per-request rather
// than being statically cached — same convention as Home and Products.
export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream-50 to-cream-50">
        <div className="container-fb py-16 text-center lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase">
              <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
              Browse
            </span>
            <h1 className="mt-6 text-4xl font-bold text-ink-900 sm:text-5xl">Shop by Categories</h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-500 sm:text-lg">
              From fresh produce to pantry staples, explore every FreshBite category and find exactly what
              you&apos;re craving.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-fb py-16 lg:py-20">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesGrid />
        </Suspense>
      </section>

      <section className="container-fb pb-16 lg:pb-20">
        <Reveal>
          <div className="card-fb flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
              <Sparkles className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="max-w-md text-sm text-ink-500">
              Browse our full product catalog to see everything FreshBite has to offer.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
            >
              Browse All Products
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/**
 * Async Server Component — fetches GET /categories directly, streamed
 * behind CategoriesSkeleton via the <Suspense> boundary above.
 */
async function CategoriesGrid() {
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <Reveal key={category._id} delay={Math.min(index * 0.05, 0.3)}>
          <CategoryBrowseCard category={category} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Richer card than the compact home-page CategoryCard (image + name +
 * optional product count + optional description + CTA). The backend's
 * Category schema only actually returns { _id, name, image }, so
 * productCount/description render only if a future response includes
 * them — nothing here is invented.
 */
function CategoryBrowseCard({ category }) {
  return (
    <div className="card-fb group flex flex-col overflow-hidden transition hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <ImageWithFallback src={category.image} alt={category.name} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-ink-900">{category.name}</h3>

        {typeof category.productCount === "number" && (
          <p className="mt-1 text-sm text-ink-400">
            {category.productCount} product{category.productCount === 1 ? "" : "s"}
          </p>
        )}

        {category.description && <p className="mt-2 text-sm text-ink-500">{category.description}</p>}

        <Link
          href={`/products?category=${category._id}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          Browse Products
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
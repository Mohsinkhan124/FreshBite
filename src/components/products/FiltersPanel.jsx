"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { filtersToQueryString } from "@/lib/products/query";
import { cn } from "@/utils/cn";

/**
 * Filter fields only — no chrome. Rendered inside the desktop sidebar
 * card and inside the mobile drawer so the two never fall out of sync.
 */
export default function FiltersPanel({ categories, filters, onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? "");

  useEffect(() => {
    setMinPrice(filters.minPrice ?? "");
    setMaxPrice(filters.maxPrice ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  function navigate(overrides) {
    router.push(`${pathname}${filtersToQueryString(filters, { page: 1, ...overrides })}`, { scroll: false });
    onNavigate?.();
  }

  function handleCategoryClick(categoryId) {
    navigate({ category: filters.category === categoryId ? "" : categoryId });
  }

  function handleFeaturedToggle() {
    navigate({ featured: !filters.featured });
  }

  function handlePriceApply(event) {
    event.preventDefault();
    navigate({
      minPrice: minPrice === "" ? null : Number(minPrice),
      maxPrice: maxPrice === "" ? null : Number(maxPrice),
    });
  }

  function handleReset() {
    router.push(pathname, { scroll: false });
    onNavigate?.();
  }

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.featured || filters.minPrice !== null || filters.maxPrice !== null,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Reset all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold tracking-wide text-ink-400 uppercase">Category</h4>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => navigate({ category: "" })}
            className={cn(
              "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
              !filters.category ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-cream-100",
            )}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategoryClick(category._id)}
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                filters.category === category._id ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-cream-100",
              )}
            >
              {category.name}
            </button>
          ))}
          {categories.length === 0 && <p className="px-3 py-2 text-sm text-ink-400">No categories available</p>}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold tracking-wide text-ink-400 uppercase">Price range</h4>
        <form onSubmit={handlePriceApply} className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="filter-min-price"
              type="number"
              min="0"
              inputMode="numeric"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
              className="h-10 w-full rounded-xl border border-cream-300 bg-cream-50 px-3 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
            <span className="text-ink-300">—</span>
            <label htmlFor="filter-max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="filter-max-price"
              type="number"
              min="0"
              inputMode="numeric"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
              className="h-10 w-full rounded-xl border border-cream-300 bg-cream-50 px-3 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <button
            type="submit"
            className="h-10 rounded-xl bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
          >
            Apply price
          </button>
        </form>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-cream-200 px-3 py-3">
        <span className="text-sm font-medium text-ink-900">Featured only</span>
        <input
          type="checkbox"
          checked={filters.featured}
          onChange={handleFeaturedToggle}
          className="h-4 w-4 accent-brand-500"
        />
      </label>
    </div>
  );
}

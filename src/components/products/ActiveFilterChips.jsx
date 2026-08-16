import Link from "next/link";
import { X } from "lucide-react";
import { filtersToQueryString } from "@/lib/products/query";

/**
 * Every chip removes exactly one filter, all via plain hrefs (no
 * client JS needed — the URL change is what drives the re-fetch).
 */
export default function ActiveFilterChips({ filters, categories }) {
  const chips = [];

  if (filters.search) {
    chips.push({
      key: "search",
      label: `Search: "${filters.search}"`,
      href: filtersToQueryString(filters, { search: "", page: 1 }),
    });
  }
  if (filters.category) {
    const category = categories.find((item) => item._id === filters.category);
    chips.push({
      key: "category",
      label: category ? category.name : "Category",
      href: filtersToQueryString(filters, { category: "", page: 1 }),
    });
  }
  if (filters.featured) {
    chips.push({
      key: "featured",
      label: "Featured",
      href: filtersToQueryString(filters, { featured: false, page: 1 }),
    });
  }
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: "price",
      label: `Price: ${filters.minPrice ?? 0} – ${filters.maxPrice ?? "∞"}`,
      href: filtersToQueryString(filters, { minPrice: null, maxPrice: null, page: 1 }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={`/products${chip.href}`}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3.5 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-200"
        >
          {chip.label}
          <X className="h-3 w-3" strokeWidth={2.5} />
        </Link>
      ))}
      <Link
        href="/products"
        scroll={false}
        className="text-xs font-semibold text-ink-500 underline-offset-2 transition hover:text-ink-900 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}

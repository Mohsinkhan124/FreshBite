"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { filtersToQueryString } from "@/lib/products/query";

/**
 * Distinct from the navbar's global SearchBar: this one merges the
 * search term into the *current* filter set (category/price/sort
 * stay intact) instead of resetting to a fresh /products search.
 */
export default function ProductsSearchInput({ filters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(filters.search);
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim() !== filters.search) {
        router.push(`${pathname}${filtersToQueryString(filters, { search: value.trim(), page: 1 })}`, {
          scroll: false,
        });
      }
    }, 450);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleSubmit(event) {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(`${pathname}${filtersToQueryString(filters, { search: value.trim(), page: 1 })}`, { scroll: false });
  }

  function handleClear() {
    setValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(`${pathname}${filtersToQueryString(filters, { search: "", page: 1 })}`, { scroll: false });
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative flex-1">
      <Search
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
        strokeWidth={2}
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-cream-300 bg-white py-2 pr-10 pl-11 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </form>
  );
}

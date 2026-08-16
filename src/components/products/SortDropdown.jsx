"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS, filtersToQueryString } from "@/lib/products/query";

export default function SortDropdown({ filters }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(event) {
    router.push(`${pathname}${filtersToQueryString(filters, { sort: event.target.value, page: 1 })}`, {
      scroll: false,
    });
  }

  return (
    <label className="flex h-11 items-center gap-2 rounded-full border border-cream-300 bg-white px-4 text-sm font-medium text-ink-700">
      <ArrowUpDown className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.8} />
      <span className="sr-only">Sort by</span>
      <select
        value={filters.sort}
        onChange={handleChange}
        className="h-full cursor-pointer border-none bg-transparent pr-1 text-sm font-medium text-ink-900 outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

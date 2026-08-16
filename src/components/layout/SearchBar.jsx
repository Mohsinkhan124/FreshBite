"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Product search input. Submits to /products?search=<query>.
 * The actual filtering is wired up to the product grid in Feature 7 —
 * this component only owns the query string and navigation.
 */
export default function SearchBar({ className, onSubmit, autoFocus = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400"
        strokeWidth={2}
      />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for fresh produce, brands..."
        autoFocus={autoFocus}
        aria-label="Search products"
        className="h-11 w-full rounded-full border border-cream-300 bg-cream-50 py-2 pr-4 pl-10 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </form>
  );
}

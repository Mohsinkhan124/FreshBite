"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export default function AdminPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 border-t border-cream-200 px-4 py-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </button>

      <span className="px-2 text-sm font-medium text-ink-700">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn("flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200 disabled:opacity-40")}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

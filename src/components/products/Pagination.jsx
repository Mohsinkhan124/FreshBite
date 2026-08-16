import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { filtersToQueryString } from "@/lib/products/query";
import { cn } from "@/utils/cn";

export default function Pagination({ currentPage, totalPages, filters }) {
  if (totalPages <= 1) return null;

  const pageHref = (page) => `/products${filtersToQueryString(filters, { page })}`;
  const pages = getPageList(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <PageLink href={pageHref(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </PageLink>

      {pages.map((page, index) =>
        page === "…" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-ink-400">
            …
          </span>
        ) : (
          <PageLink key={page} href={pageHref(page)} active={page === currentPage}>
            {page}
          </PageLink>
        ),
      )}

      <PageLink
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, active, disabled, children, ...rest }) {
  if (disabled) {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-ink-300" aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition",
        active ? "bg-brand-500 text-white shadow-brand" : "text-ink-700 hover:bg-cream-200",
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

function getPageList(current, total, siblings = 1) {
  const pages = [1];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  if (start > 2) pages.push("…");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("…");
  if (total > 1) pages.push(total);

  return pages;
}

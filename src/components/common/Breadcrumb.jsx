import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

/**
 * Generic breadcrumb trail. `items` is a list of { label, href? } —
 * the final item is typically given without an `href` to render as
 * the current, non-clickable page.
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
      <Link href="/" className="flex items-center gap-1 transition hover:text-brand-600">
        <Home className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-ink-300" strokeWidth={2} />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-brand-600">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-900" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

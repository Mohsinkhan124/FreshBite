"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * Icon button with an animated count badge. Renders as a <Link> when
 * `href` is given (wishlist navigation), or as a <button> when `onClick`
 * is given instead (cart icon toggling the cart drawer) — same badge
 * markup either way so the icons stay visually identical.
 */
export default function IconBadgeLink({ href, onClick, icon: Icon, label, count = 0, className }) {
  const content = (
    <>
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute top-0 right-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white shadow-brand"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );

  const sharedClassName = cn(
    "relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200 hover:text-brand-600",
    className,
  );
  const ariaLabel = count > 0 ? `${label} (${count})` : label;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={sharedClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={sharedClassName}>
      {content}
    </Link>
  );
}

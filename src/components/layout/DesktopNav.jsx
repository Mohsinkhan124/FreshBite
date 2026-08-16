"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MAIN_NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/utils/cn";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
      {MAIN_NAV_LINKS.map((link) => {
        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive ? "text-brand-700" : "text-ink-700 hover:text-brand-600",
            )}
          >
            <span className="relative z-10">{link.label}</span>
            {isActive && (
              <motion.span
                layoutId="desktop-nav-active"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-brand-100"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

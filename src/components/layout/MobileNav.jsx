"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogIn, Package, ShoppingCart, User, UserPlus, X } from "lucide-react";
import { MAIN_NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import { useDialogA11y } from "@/hooks/useDialogA11y";

/**
 * Slide-in mobile navigation drawer. Locks page scroll while open and
 * closes itself automatically after a route change.
 */
export default function MobileNav({ open, onClose }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth?.user ?? null);
  const panelRef = useRef(null);

  useDialogA11y(open, onClose, panelRef);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onCloseRef.current();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-lift lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
              <span className="font-display text-lg font-bold text-brand-600">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav aria-label="Primary" className="flex flex-col gap-1">
                {MAIN_NAV_LINKS.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-xl px-4 py-3 text-base font-medium transition",
                        isActive ? "bg-brand-100 text-brand-700" : "text-ink-700 hover:bg-cream-100",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-6 h-px bg-cream-200" />

              <nav aria-label="Account" className="flex flex-col gap-1">
                <MobileLink href="/wishlist" icon={Heart} label="Wishlist" />
                <MobileLink href="/cart" icon={ShoppingCart} label="Cart" />

                {user ? (
                  <>
                    <MobileLink href="/profile" icon={User} label="Profile" />
                    <MobileLink href="/orders" icon={Package} label="My orders" />
                  </>
                ) : (
                  <>
                    <MobileLink href="/login" icon={LogIn} label="Log in" />
                    <MobileLink href="/register" icon={UserPlus} label="Create account" />
                  </>
                )}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MobileLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-ink-700 transition hover:bg-cream-100"
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      {label}
    </Link>
  );
}

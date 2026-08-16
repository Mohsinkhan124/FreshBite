"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { closeCartDrawer } from "@/redux/slices/cartSlice";
import { isAuthenticated } from "@/utils/auth";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import EmptyState from "@/components/home/EmptyState";
import LoginPrompt from "@/components/common/LoginPrompt";
import CartLineItem from "./CartLineItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.cart.isDrawerOpen);
  const items = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const grandTotal = useSelector((state) => state.cart.grandTotal);
  const panelRef = useRef(null);

  useDialogA11y(open, () => dispatch(closeCartDrawer()), panelRef);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const signedIn = isAuthenticated();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm"
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
              aria-label="Shopping cart"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-lift"
            >
            <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
              <span className="font-display text-lg font-bold text-brand-600">Your cart</span>
              <button
                type="button"
                onClick={() => dispatch(closeCartDrawer())}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {!signedIn ? (
                <LoginPrompt message="Log in to view your cart." />
              ) : status === "loading" && items.length === 0 ? (
                <p className="py-16 text-center text-sm text-ink-400">Loading your cart...</p>
              ) : items.length === 0 ? (
                <EmptyState icon={ShoppingBag} title="Your cart is empty" description="Add items to see them here." />
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartLineItem key={item._id} item={item} compact />
                  ))}
                </div>
              )}
            </div>

            {signedIn && items.length > 0 && (
              <div className="border-t border-cream-200 px-5 py-5">
                <CartSummary subtotal={grandTotal} compact />
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={() => dispatch(closeCartDrawer())}
                    className="flex h-12 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => dispatch(closeCartDrawer())}
                    className="flex h-11 items-center justify-center rounded-full border border-cream-300 text-sm font-semibold text-ink-900 transition hover:bg-cream-100"
                  >
                    View full cart
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

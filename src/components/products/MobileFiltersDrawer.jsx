"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useDialogA11y } from "@/hooks/useDialogA11y";
import FiltersPanel from "./FiltersPanel";

export default function MobileFiltersDrawer({ categories, filters, activeCount = 0 }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useDialogA11y(open, () => setOpen(false), panelRef);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-11 items-center gap-2 rounded-full border border-cream-300 bg-white px-4 text-sm font-semibold text-ink-900 transition hover:border-brand-300 lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-lift lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
                <span className="font-display text-lg font-bold text-brand-600">Filters</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200"
                >
                  <X className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <FiltersPanel categories={categories} filters={filters} onNavigate={() => setOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

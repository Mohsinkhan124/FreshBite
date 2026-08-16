"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ReviewForm from "@/components/product-detail/ReviewForm";
import { useDialogA11y } from "@/hooks/useDialogA11y";

export default function OrderReviewModal({
  open,
  onClose,
  productName,
  submitting,
  onSubmit,
}) {
  const panelRef = useRef(null);

  useDialogA11y(open, onClose, panelRef);

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
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Write a review for ${productName}`}
            className="fixed inset-x-0 top-1/2 z-[60] mx-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="min-w-0 pr-4">
                <p className="text-xs font-medium text-brand-600">
                  Product review
                </p>

                <h2 className="mt-1 truncate text-lg font-bold text-ink-900">
                  {productName}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close review"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <ReviewForm
              submitting={submitting}
              isEditing={false}
              initialRating={0}
              initialComment=""
              onSubmit={onSubmit}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
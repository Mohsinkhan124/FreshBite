"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useDialogA11y } from "@/hooks/useDialogA11y";

/**
 * Generic confirm dialog. Pass tone="danger" (e.g. for delete actions)
 * to get the red-accented "Delete Modal" styling — same component,
 * no duplication between "confirm" and "delete" dialogs.
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default", // "default" | "danger"
  loading = false,
  onConfirm,
  onCancel,
}) {
  const panelRef = useRef(null);
  useDialogA11y(open, onCancel, panelRef);

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
            onClick={onCancel}
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
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 top-1/2 z-[60] mx-auto w-[calc(100%-2rem)] max-w-sm -translate-y-1/2 rounded-3xl bg-white p-6 text-center shadow-lift"
          >
            <div
              className={cn(
                "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
                tone === "danger" ? "bg-danger/10 text-danger" : "bg-brand-100 text-brand-600",
              )}
            >
              <AlertTriangle className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-ink-900">{title}</h2>
            {description && <p className="mt-2 text-sm text-ink-500">{description}</p>}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="h-11 flex-1 rounded-full border border-cream-300 text-sm font-semibold text-ink-900 transition hover:bg-cream-100 disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  "h-11 flex-1 rounded-full text-sm font-semibold text-white shadow-brand transition disabled:cursor-not-allowed disabled:opacity-60",
                  tone === "danger" ? "bg-danger hover:bg-danger/90" : "bg-brand-500 hover:bg-brand-600",
                )}
              >
                {loading ? "Please wait..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

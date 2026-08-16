"use client";

import { useEffect } from "react";

/**
 * Accessibility helper for modals/drawers: closes on Escape, and moves
 * focus into the panel when it opens so keyboard/screen-reader users
 * land somewhere sensible instead of focus staying on a now-hidden
 * trigger button.
 *
 * `panelRef` should point at the dialog/panel element and have
 * `tabIndex={-1}` so it's programmatically focusable without adding a
 * stop to the regular Tab order.
 */
export function useDialogA11y(open, onClose, panelRef) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    panelRef?.current?.focus?.();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, panelRef]);
}

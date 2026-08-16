"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Tag, X } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

/**
 * Coupon box has two modes:
 *  - No `onApplyCoupon` passed (Cart drawer/page, Feature 6): stays
 *    UI-only and honest that coupons aren't wired up there.
 *  - `onApplyCoupon` passed (Checkout, Feature 8): calls the real
 *    POST /coupons/apply through the caller-provided handler and shows
 *    the actual discount/applied-coupon state.
 *
 * Shipping is shown as "Free" — the order controller never adds a
 * shipping charge (finalAmount is always totalAmount minus discount),
 * so that's accurate rather than an invented fee.
 */
export default function CartSummary({
  subtotal,
  compact = false,
  onApplyCoupon,
  appliedCoupon = null,
  onRemoveCoupon,
}) {
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = appliedCoupon?.finalAmount ?? subtotal;

  async function handleApplyCoupon(event) {
    event.preventDefault();
    const code = coupon.trim();
    if (!code) return;

    if (!onApplyCoupon) {
      toast.error("Coupons aren't available yet");
      return;
    }

    setApplying(true);
    try {
      await onApplyCoupon(code);
      setCoupon("");
    } catch (error) {
      toast.error(error?.message || error || "Invalid coupon code");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className={cn("space-y-4", !compact && "card-fb p-6")}>
      {!compact && <h2 className="text-base font-semibold text-ink-900">Order summary</h2>}

      {appliedCoupon ? (
        <div className="flex items-center justify-between rounded-full border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm">
          <span className="flex items-center gap-2 font-semibold text-brand-700">
            <Tag className="h-3.5 w-3.5" strokeWidth={2} />
            {appliedCoupon.code} applied
          </span>
          {onRemoveCoupon && (
            <button
              type="button"
              onClick={onRemoveCoupon}
              aria-label="Remove coupon"
              className="text-brand-600 transition hover:text-brand-800"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
          <label htmlFor="cart-coupon" className="sr-only">
            Coupon code
          </label>
          <div className="relative flex-1">
            <Tag
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400"
              strokeWidth={1.8}
            />
            <input
              id="cart-coupon"
              type="text"
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              placeholder="Coupon code"
              className="h-11 w-full rounded-full border border-cream-300 bg-cream-50 py-2 pr-4 pl-10 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <button
            type="submit"
            disabled={applying}
            className="h-11 shrink-0 rounded-full border border-cream-300 px-4 text-sm font-semibold text-ink-900 transition hover:bg-cream-100 disabled:opacity-60"
          >
            {applying ? "Applying..." : "Apply"}
          </button>
        </form>
      )}

      <div className="space-y-2 border-t border-cream-200 pt-4 text-sm">
        <div className="flex items-center justify-between text-ink-500">
          <span>Subtotal</span>
          <span className="font-semibold text-ink-900">{formatCurrency(subtotal)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between text-success">
            <span>Discount ({appliedCoupon.discount}%)</span>
            <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-ink-500">
          <span>Shipping</span>
          <span className="font-semibold text-success">Free</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-cream-200 pt-4">
        <span className="text-sm font-semibold text-ink-900">Total</span>
        <span className="text-lg font-bold text-ink-900">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

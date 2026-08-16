"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import { removeItemFromCart, updateCartItemQuantity } from "@/redux/slices/cartSlice";
import ImageWithFallback from "@/components/home/ImageWithFallback";

export default function CartLineItem({ item, compact = false }) {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product || {};
  const stock = typeof product.stock === "number" ? product.stock : null;
  const price = item.priceAtTime ?? product.price ?? 0;
  const lineTotal = item.subtotal ?? price * item.quantity;

  async function changeQuantity(nextQuantity) {
    if (nextQuantity < 1 || isUpdating) return;
    if (stock !== null && nextQuantity > stock) {
      toast.error(`Only ${stock} left in stock`);
      return;
    }
    setIsUpdating(true);
    try {
      await dispatch(updateCartItemQuantity({ id: item._id, quantity: nextQuantity })).unwrap();
    } catch (error) {
      toast.error(error || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemove() {
    setIsRemoving(true);
    try {
      await dispatch(removeItemFromCart(item._id)).unwrap();
      toast.success(`${product.name || "Item"} removed from cart`);
    } catch (error) {
      toast.error(error || "Failed to remove item");
      setIsRemoving(false);
    }
  }

  return (
    <div className={cn("flex gap-4", isRemoving && "pointer-events-none opacity-50")}>
      <Link
        href={`/products/${product._id}`}
        className={cn("shrink-0 overflow-hidden rounded-2xl bg-cream-100", compact ? "h-20 w-20" : "h-24 w-24")}
      >
        <ImageWithFallback src={product.image} alt={product.name} />
        
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product._id}`}
            className="text-sm font-semibold text-ink-900 transition hover:text-brand-600"
          >
            {product.name}
          </Link>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label="Remove item"
            className="shrink-0 text-ink-400 transition hover:text-danger"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

<p className="mt-0.5 text-xs text-ink-400">
  {formatCurrency(price)} / {product.unit || "kg"}
</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-cream-300">
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span className="text-xs font-semibold text-ink-900 px-2">
  {item.quantity} {product.unit || "kg"}
</span>
            <button
              type="button"
              onClick={() => changeQuantity(item.quantity + 1)}
              disabled={isUpdating || (stock !== null && item.quantity >= stock)}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

<div className="text-right">
  <p className="text-sm font-bold text-ink-900">
    {formatCurrency(lineTotal)}
  </p>
  <p className="text-[11px] text-ink-400">
    {item.quantity} × {product.unit || "kg"}
  </p>
</div>
        </div>
      </div>
    </div>
  );
}

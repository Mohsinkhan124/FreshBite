"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import { cn } from "@/utils/cn";
import { isAuthenticated } from "@/utils/auth";
import { addItemToCart, openCartDrawer } from "@/redux/slices/cartSlice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/slices/wishlistSlice";

/**
 * Add-to-cart and wishlist are wired to the real Cart/Wishlist Redux
 * slices (Feature 6), same as ProductCard. Both require auth — guests
 * are redirected to /login instead of hitting a raw 401.
 */
export default function ProductActions({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const wishlistEntry = useSelector((state) =>
    (state.wishlist?.items || []).find((item) => item.product?._id === product._id),
  );
  const wishlisted = Boolean(wishlistEntry);

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;

  function decrement() {
    setQuantity((value) => Math.max(1, value - 1));
  }

  function increment() {
    setQuantity((value) => Math.min(stock || 1, value + 1));
  }

  function ensureAuthenticated() {
    if (isAuthenticated()) return true;
    toast.error("Log in to continue");
    router.push("/login");
    return false;
  }

  async function handleAddToCart() {
    if (outOfStock || addingToCart || !ensureAuthenticated()) return;

    setAddingToCart(true);
    try {
      await dispatch(addItemToCart({ product: product._id, quantity })).unwrap();
      toast.success(`${quantity} × ${product.name} added to cart`);
      dispatch(openCartDrawer());
    } catch (error) {
      toast.error(error || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  async function toggleWishlist() {
    if (togglingWishlist || !ensureAuthenticated()) return;

    setTogglingWishlist(true);
    try {
      if (wishlisted) {
        await dispatch(removeItemFromWishlist(wishlistEntry._id)).unwrap();
        toast.success(`${product.name} removed from wishlist`);
      } else {
        await dispatch(addItemToWishlist(product._id)).unwrap();
        toast.success(`${product.name} added to wishlist`);
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setTogglingWishlist(false);
    }
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // Share sheet dismissed — nothing to do.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-ink-900">Quantity</span>
        <div className="flex items-center rounded-full border border-cream-300">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-ink-900">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={outOfStock || quantity >= stock}
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || addingToCart}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-cream-300 disabled:text-ink-400 disabled:shadow-none sm:flex-none"
        >
          <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          {outOfStock ? "Out of stock" : addingToCart ? "Adding..." : "Add to cart"}
        </button>

        <button
          type="button"
          onClick={toggleWishlist}
          disabled={togglingWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border transition disabled:opacity-60",
            wishlisted
              ? "border-danger bg-danger/5 text-danger"
              : "border-cream-300 text-ink-700 hover:border-brand-300 hover:text-brand-600",
          )}
        >
          <Heart className={cn("h-5 w-5", wishlisted && "fill-danger")} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share product"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-cream-300 text-ink-700 transition hover:border-brand-300 hover:text-brand-600"
        >
          <Share2 className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import { isAuthenticated } from "@/utils/auth";
import { addItemToCart, openCartDrawer } from "@/redux/slices/cartSlice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/slices/wishlistSlice";
import ImageWithFallback from "./ImageWithFallback";

/**
 * Add-to-cart and wishlist are wired to the real Cart/Wishlist Redux
 * slices (Feature 6), which call the backend directly. Both endpoints
 * require auth — with no login flow yet, guests are redirected to
 * /login instead of getting a confusing 401.
 */
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

  const wishlistEntry = useSelector((state) =>
    (state.wishlist?.items || []).find((item) => item.product?._id === product._id),
  );
  const wishlisted = Boolean(wishlistEntry);

  const outOfStock = (product.stock ?? 0) <= 0;
  const rating = Math.round(product.averageRating || 0);

  function ensureAuthenticated() {
    if (isAuthenticated()) return true;
    toast.error("Log in to continue");
    router.push("/login");
    return false;
  }

  async function toggleWishlist(event) {
    event.preventDefault();
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

  async function handleAddToCart(event) {
    event.preventDefault();
    if (outOfStock || addingToCart || !ensureAuthenticated()) return;

    setAddingToCart(true);
    try {
      await dispatch(addItemToCart({ product: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
      dispatch(openCartDrawer());
    } catch (error) {
      toast.error(error || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card-fb group overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <Link href={`/products/${product._id}`} className="absolute inset-0 z-0" aria-label={product.name}>
          <ImageWithFallback src={product.image} alt={product.name} />
        </Link>

        <button
          type="button"
          onClick={toggleWishlist}
          disabled={togglingWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft backdrop-blur transition hover:bg-white disabled:opacity-60"
        >
          <Heart className={cn("h-4 w-4 transition", wishlisted && "fill-danger text-danger")} strokeWidth={1.8} />
        </button>

        {product.featured && (
          <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-brand">
            Featured
          </span>
        )}

        {outOfStock && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink-900/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-900">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/products/${product._id}`} className="block">
          {product.category?.name && <p className="text-xs font-medium text-ink-400">{product.category.name}</p>}
          <h3 className="mt-1 truncate text-sm font-semibold text-ink-900">{product.name}</h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn("h-3.5 w-3.5", index < rating ? "fill-warning text-warning" : "text-cream-300")}
              strokeWidth={1.5}
            />
          ))}
          {product.totalReviews > 0 && <span className="ml-1 text-xs text-ink-400">({product.totalReviews})</span>}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
  <span className="text-base font-bold text-ink-900">
    {formatCurrency(product.price)}
    {product.unit && (
      <span className="text-sm font-medium text-ink-500">
        {" "}
        / {product.unit}
      </span>
    )}
  </span>

  <span className="text-xs text-ink-400">
    Stock: {product.stock} {product.unit}
  </span>
</div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || addingToCart}
            aria-label="Add to cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-cream-300 disabled:shadow-none"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";
import { isAuthenticated } from "@/utils/auth";
import Breadcrumb from "@/components/common/Breadcrumb";
import LoginPrompt from "@/components/common/LoginPrompt";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import ProductCard from "@/components/home/ProductCard";
import Reveal from "@/components/home/Reveal";
import ProductGridSkeleton from "@/components/home/ProductGridSkeleton";

export default function WishlistPageContent() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);
  const status = useSelector((state) => state.wishlist.status);
  const signedIn = isAuthenticated();

  useEffect(() => {
    if (signedIn) dispatch(fetchWishlist());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Your wishlist</h1>

      <div className="mt-8">
        {!signedIn ? (
          <LoginPrompt message="Log in to view your wishlist." />
        ) : status === "loading" && items.length === 0 ? (
          <ProductGridSkeleton />
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load your wishlist right now." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products you love to find them here later."
          />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, index) => (
              <Reveal key={item._id} delay={Math.min(index * 0.05, 0.25)}>
                <ProductCard product={item.product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

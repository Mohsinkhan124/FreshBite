"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { clearCart, fetchCart } from "@/redux/slices/cartSlice";
import { isAuthenticated } from "@/utils/auth";
import Breadcrumb from "@/components/common/Breadcrumb";
import LoginPrompt from "@/components/common/LoginPrompt";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import CartLineItem from "./CartLineItem";
import CartSummary from "./CartSummary";

export default function CartPageContent() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const grandTotal = useSelector((state) => state.cart.grandTotal);
  const signedIn = isAuthenticated();

  useEffect(() => {
    if (signedIn) dispatch(fetchCart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClearCart() {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error || "Failed to clear cart");
    }
  }

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Your cart</h1>

      <div className="mt-8">
        {!signedIn ? (
          <LoginPrompt message="Log in to view your cart." />
        ) : status === "loading" && items.length === 0 ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="card-fb flex gap-4 p-4">
                  <div className="skeleton h-24 w-24 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="skeleton h-64 rounded-3xl" />
          </div>
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load your cart right now." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse products and add your favorites to the cart."
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-500">
                  {items.length} item{items.length === 1 ? "" : "s"} in your cart
                </p>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-sm font-semibold text-ink-500 transition hover:text-danger"
                >
                  Clear cart
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="card-fb p-4">
                    <CartLineItem item={item} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <CartSummary subtotal={grandTotal} />
              <Link
                href="/checkout"
                className="mt-4 flex h-12 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

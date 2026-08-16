"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { resetCart } from "@/redux/slices/cartSlice";
import { applyCoupon as applyCouponApi } from "@/lib/api/coupons";
import { createOrder } from "@/lib/api/orders";
import { STORAGE_KEYS } from "@/constants/config";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/home/EmptyState";
import CartLineItem from "@/components/cart/CartLineItem";
import CartSummary from "@/components/cart/CartSummary";
import AddressSection from "./AddressSection";

export default function CheckoutPageContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector((state) => state.cart.items);
  const grandTotal = useSelector((state) => state.cart.grandTotal);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  async function handleApplyCoupon(code) {
    const data = await applyCouponApi({ code, totalAmount: grandTotal });
    setAppliedCoupon({
      code: data.coupon,
      discount: data.discount,
      discountAmount: data.discountAmount,
      finalAmount: data.finalAmount,
    });
    toast.success(data?.message || "Coupon applied successfully");
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
  }

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      toast.error("Select a shipping address");
      return;
    }

    setPlacingOrder(true);
    try {
      const data = await createOrder({
        addressId: selectedAddressId,
        paymentMethod: "COD",
        couponCode: appliedCoupon?.code,
      });

      if (typeof window !== "undefined" && data?.order) {
        window.sessionStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(data.order));
      }

      dispatch(resetCart());
      toast.success(data?.message || "Order placed successfully");
      router.push("/checkout/success");
    } catch (error) {
      toast.error(error?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="container-fb py-10 lg:py-14">
        <Breadcrumb items={[{ label: "Checkout" }]} />
        <div className="mt-8">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add items to your cart before checking out."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Checkout" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <AddressSection selectedAddressId={selectedAddressId} onSelectAddress={setSelectedAddressId} />

          <div>
            <h2 className="text-base font-semibold text-ink-900">Order items</h2>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <motion.div key={item._id} layout className="card-fb p-4">
                  <CartLineItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 space-y-4">
            <CartSummary
              subtotal={grandTotal}
              onApplyCoupon={handleApplyCoupon}
              appliedCoupon={appliedCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placingOrder ? "Placing order..." : "Place order"}
            </button>
            <p className="text-center text-xs text-ink-400">Cash on Delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
}

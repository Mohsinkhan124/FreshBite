"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { STORAGE_KEYS } from "@/constants/config";

export default function OrderSuccessContent() {
  const [order, setOrder] = useState(undefined); // undefined = checking, null = none found

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEYS.lastOrder);
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) {
    return null;
  }

  if (!order) {
    return (
      <section className="container-fb flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-bold text-ink-900">No recent order found</h1>
        <p className="mt-2 text-sm text-ink-500">Head back to your orders to see order history.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="container-fb flex flex-col items-center py-16 text-center lg:py-24">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.8} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <h1 className="mt-6 text-3xl font-bold text-ink-900 sm:text-4xl">Order placed!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Order <span className="font-semibold text-ink-900">{order.orderNumber}</span> is confirmed. A receipt has
          been emailed to you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="card-fb mt-8 w-full max-w-lg p-6 text-left"
      >
        <div className="flex items-center gap-2 border-b border-cream-200 pb-4">
          <PackageCheck className="h-4 w-4 text-brand-600" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-ink-900">Order summary</span>
        </div>

        <div className="mt-4 space-y-3">
          {(order.items || []).map((item, index) => (
            <div key={item.product || index} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">
                {item.name} <span className="text-ink-400">× {item.quantity}</span>
              </span>
              <span className="font-semibold text-ink-900">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-ink-500">
            <span>Subtotal</span>
            <span className="font-semibold text-ink-900">{formatCurrency(order.totalAmount)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between text-success">
              <span>Discount {order.coupon ? `(${order.coupon})` : ""}</span>
              <span className="font-semibold">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-cream-200 pt-2 text-base font-bold text-ink-900">
            <span>Total</span>
            <span>{formatCurrency(order.finalAmount)}</span>
          </div>
        </div>

        {order.address && (
          <div className="mt-4 border-t border-cream-200 pt-4 text-sm text-ink-500">
            <p className="font-semibold text-ink-900">{order.address.fullName}</p>
            <p className="mt-1">
              {order.address.street}, {order.address.city}, {order.address.state} {order.address.postalCode},{" "}
              {order.address.country}
            </p>
            <p className="mt-1">{order.address.phone}</p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href="/orders"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          View my orders
        </Link>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full border border-cream-300 px-6 text-sm font-semibold text-ink-900 transition hover:bg-cream-100"
        >
          Continue shopping
        </Link>
      </motion.div>
    </section>
  );
}

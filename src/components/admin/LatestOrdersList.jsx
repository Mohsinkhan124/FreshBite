"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { getLatestOrders } from "@/lib/api/dashboard";
import { formatCurrency, formatDate } from "@/utils/format";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

/**
 * Not linked to the customer order-detail page: getSingleOrder strictly
 * checks order.user === req.user.id with no admin bypass, so an admin
 * clicking through to /orders/:id for another customer's order would
 * just get a 403. This stays a read-only summary instead.
 */
export default function LatestOrdersList() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const res = await getLatestOrders();
      setOrders(Array.isArray(res?.analytics) ? res.analytics : []);
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (status === "loading") {
    return (
      <div className="card-fb p-6">
        <div className="skeleton h-5 w-32" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card-fb p-6">
        <ErrorState description="We couldn't load the latest orders right now." onRetry={load} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card-fb p-6">
        <EmptyState icon={ClipboardList} title="No orders yet" description="New orders will show up here." />
      </div>
    );
  }

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">Latest orders</h2>
      <div className="mt-4 divide-y divide-cream-200">
        {orders.map((order) => (
          <div key={order._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">{order.orderNumber}</p>
              <p className="mt-0.5 truncate text-xs text-ink-400">
                {order.user?.name || "Unknown"} · {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-bold text-ink-900">{formatCurrency(order.finalAmount)}</span>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

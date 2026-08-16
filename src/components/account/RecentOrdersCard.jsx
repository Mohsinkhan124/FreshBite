"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getMyOrders } from "@/lib/api/orders";
import { formatCurrency, formatDate } from "@/utils/format";
import EmptyState from "@/components/home/EmptyState";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default function RecentOrdersCard() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  useEffect(() => {
    let cancelled = false;
    getMyOrders()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.orders) ? data.orders : [];
        setOrders(list.slice(0, 5));
        setStatus("succeeded");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="card-fb p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-900">Recent Orders</h2>
        <Link href="/orders" className="text-sm font-semibold text-brand-600 transition hover:text-brand-700">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {status === "loading" ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : status === "failed" ? (
          <p className="py-6 text-center text-sm text-ink-400">We couldn&apos;t load your orders right now.</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="Your placed orders will show up here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-cream-200 text-xs font-semibold tracking-wide text-ink-400 uppercase">
                <tr>
                  <th className="py-2 pr-3">Order ID</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {orders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-cream-50">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/orders/${order._id}`}
                        className="font-medium text-ink-900 transition hover:text-brand-600"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-ink-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3 pr-3">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="py-3 text-right font-semibold text-ink-900">
                      {formatCurrency(order.finalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

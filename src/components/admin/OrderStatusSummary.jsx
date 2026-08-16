"use client";

import { useEffect, useState } from "react";
import { PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { getOrderStatusAnalytics } from "@/lib/api/analytics";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default function OrderStatusSummary() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const res = await getOrderStatusAnalytics();
      setData(Array.isArray(res?.analytics) ? res.analytics : []);
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
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-8 w-full rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card-fb p-6">
        <ErrorState description="We couldn't load order status data right now." onRetry={load} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-fb p-6">
        <EmptyState
          icon={PieChart}
          title="No orders yet"
          description="Order status breakdown will appear here once orders come in."
        />
      </div>
    );
  }

  const maxTotal = Math.max(...data.map((item) => item.total), 1);

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">Order status</h2>
      <div className="mt-5 space-y-3">
        {data.map((item, index) => (
          <div key={item._id}>
            <div className="mb-1.5 flex items-center justify-between">
              <OrderStatusBadge status={item._id} />
              <span className="text-sm font-semibold text-ink-900">{item.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, Math.round((item.total / maxTotal) * 100))}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-brand-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

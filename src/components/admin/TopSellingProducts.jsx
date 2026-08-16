"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getTopSellingProducts } from "@/lib/api/analytics";
import { formatCurrency } from "@/utils/format";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import Reveal from "@/components/home/Reveal";

export default function TopSellingProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const res = await getTopSellingProducts();
      setProducts(Array.isArray(res?.analytics) ? res.analytics : []);
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
        <div className="skeleton h-5 w-40" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card-fb p-6">
        <ErrorState description="We couldn't load top products right now." onRetry={load} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="card-fb p-6">
        <EmptyState
          icon={Trophy}
          title="No sales yet"
          description="Best-selling products will appear here once orders come in."
        />
      </div>
    );
  }

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">Top selling products</h2>
      <div className="mt-5 space-y-4">
        {products.map((product, index) => (
          <Reveal key={product._id} delay={Math.min(index * 0.05, 0.2)}>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{product.name}</p>
                <p className="text-xs text-ink-400">{product.totalSold} sold</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-ink-900">{formatCurrency(product.revenue)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

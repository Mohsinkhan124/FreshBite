"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { getMonthlySales } from "@/lib/api/analytics";
import { formatCompact } from "@/utils/format";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";

/**
 * Built as a plain CSS/Framer-Motion bar chart rather than pulling in a
 * charting library — the project's dependencies haven't included one
 * through any earlier feature, so this avoids adding a new one just
 * for a single chart.
 */
export default function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const res = await getMonthlySales();
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
        <div className="skeleton h-5 w-40" />
        <div className="mt-6 flex h-48 items-end gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="skeleton flex-1 rounded-t-lg"
              style={{ height: `${30 + (index % 4) * 15}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card-fb p-6">
        <ErrorState description="We couldn't load sales analytics right now." onRetry={load} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card-fb p-6">
        <EmptyState
          icon={BarChart3}
          title="No sales yet"
          description="Monthly revenue will appear here once orders come in."
        />
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <div className="card-fb p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-900">Monthly sales</h2>
        <BarChart3 className="h-4 w-4 text-ink-400" strokeWidth={1.8} />
      </div>

      <div className="mt-6 flex h-52 items-end gap-3 sm:gap-4">
        {data.map((item, index) => {
          const heightPct = Math.max(6, Math.round((item.revenue / maxRevenue) * 100));
          return (
            <div key={`${item.month}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[11px] font-semibold text-ink-500">{formatCompact(item.revenue)}</span>
              <div className="flex h-40 w-full items-end overflow-hidden rounded-lg bg-cream-100">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-400"
                />
              </div>
              <span className="text-xs font-medium text-ink-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

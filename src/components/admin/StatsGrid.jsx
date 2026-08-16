"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Boxes, ClipboardList, DollarSign, PackageSearch, ShoppingBag, Users } from "lucide-react";
import { getDashboardStats } from "@/lib/api/dashboard";
import { formatCurrency } from "@/utils/format";
import ErrorState from "@/components/home/ErrorState";
import Reveal from "@/components/home/Reveal";
import StatsCard from "./StatsCard";

export default function StatsGrid() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const data = await getDashboardStats();
      setStats(data?.stats || null);
      setStatus(data?.stats ? "succeeded" : "failed");
    } catch (error) {
      toast.error(error?.message || "We couldn't load dashboard stats");
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card-fb flex items-center gap-4 p-5">
            <div className="skeleton h-12 w-12 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-5 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed" || !stats) {
    return <ErrorState description="We couldn't load dashboard stats right now." onRetry={load} />;
  }

  const cards = [
    {
      key: "totalRevenue",
      icon: DollarSign,
      label: "Total revenue",
      value: formatCurrency(stats.totalRevenue),
      accent: true,
    },
    { key: "totalOrders", icon: ShoppingBag, label: "Total orders", value: stats.totalOrders },
    { key: "totalUsers", icon: Users, label: "Total users", value: stats.totalUsers },
    { key: "totalProducts", icon: Boxes, label: "Total products", value: stats.totalProducts },
    { key: "pendingOrders", icon: ClipboardList, label: "Pending orders", value: stats.pendingOrders },
    { key: "lowStockProducts", icon: PackageSearch, label: "Low stock", value: stats.lowStockProducts },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card, index) => (
        <Reveal key={card.key} delay={Math.min(index * 0.05, 0.2)}>
          <StatsCard icon={card.icon} label={card.label} value={card.value} accent={card.accent} />
        </Reveal>
      ))}
    </div>
  );
}

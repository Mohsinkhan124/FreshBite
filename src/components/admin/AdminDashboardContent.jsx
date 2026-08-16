"use client";

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/common/Breadcrumb";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import MonthlySalesChart from "./MonthlySalesChart";
import OrderStatusSummary from "./OrderStatusSummary";
import TopSellingProducts from "./TopSellingProducts";
import LatestOrdersList from "./LatestOrdersList";
import LatestUsersList from "./LatestUsersList";

export default function AdminDashboardContent() {
  const user = useSelector((state) => state.auth?.user);

  return (
    <div className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Admin" }]} />

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">
          {user?.name ? `Welcome back, ${user.name}.` : "Welcome back."} Here&apos;s what&apos;s happening today.
        </p>
      </motion.div>

      <div className="mt-8">
        <QuickActions />
      </div>

      <div className="mt-8">
        <StatsGrid />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlySalesChart />
        </div>
        <OrderStatusSummary />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <TopSellingProducts />
        <div className="space-y-6">
          <LatestOrdersList />
          <LatestUsersList />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PackageSearch } from "lucide-react";
import { getMyOrders } from "@/lib/api/orders";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import Reveal from "@/components/home/Reveal";
import OrderCard from "./OrderCard";
import OrdersListSkeleton from "./OrdersListSkeleton";

export default function OrdersPageContent() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      try {
        const data = await getMyOrders();
        if (!cancelled) {
          setOrders(Array.isArray(data?.orders) ? data.orders : []);
          setStatus("succeeded");
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error?.message || "We couldn't load your orders");
          setStatus("failed");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "My Orders" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">My orders</h1>

      <div className="mt-8">
        {status === "loading" ? (
          <OrdersListSkeleton />
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load your orders right now." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="Your placed orders will show up here."
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => (
              <Reveal key={order._id} delay={Math.min(index * 0.05, 0.25)}>
                <OrderCard order={order} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

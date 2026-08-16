"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import { cancelOrder, getAllOrders, updateOrderStatus } from "@/lib/api/orders";
import { PAGINATION } from "@/constants/config";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import AdminSearchInput from "@/components/admin/shared/AdminSearchInput";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import OrdersTable from "./OrdersTable";

const STATUS_FILTERS = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

/**
 * getAllOrders returns every order with no search/filter/pagination
 * query params supported server-side, so all three are handled here
 * client-side against the full fetched list.
 */
export default function AdminOrdersPageContent() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [updatingId, setUpdatingId] = useState(null);
  const [cancelingOrder, setCancelingOrder] = useState(null);
  const [canceling, setCanceling] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const data = await getAllOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setStatus("succeeded");
    } catch (error) {
      toast.error(error?.message || "We couldn't load orders");
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      return (
        order.orderNumber?.toLowerCase().includes(term) ||
        order.user?.name?.toLowerCase().includes(term) ||
        order.user?.email?.toLowerCase().includes(term)
      );
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGINATION.defaultLimit));
  const pagedOrders = filteredOrders.slice(
    (page - 1) * PAGINATION.defaultLimit,
    page * PAGINATION.defaultLimit,
  );

  function handleSearchChange(value) {
    setPage(1);
    setSearch(value);
  }

  function handleStatusFilterChange(value) {
    setPage(1);
    setStatusFilter(value);
  }

  async function handleUpdateStatus(order, orderStatus) {
    setUpdatingId(order._id);
    try {
      const data = await updateOrderStatus(order._id, orderStatus);
      toast.success(data?.message || "Order status updated successfully");
      setOrders((previous) => previous.map((item) => (item._id === order._id ? { ...item, orderStatus } : item)));
    } catch (error) {
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleConfirmCancel() {
    if (!cancelingOrder) return;
    setCanceling(true);
    try {
      const data = await cancelOrder(cancelingOrder._id);
      toast.success(data?.message || "Order cancelled successfully");
      setOrders((previous) =>
        previous.map((item) => (item._id === cancelingOrder._id ? { ...item, orderStatus: "Cancelled" } : item)),
      );
      setCancelingOrder(null);
    } catch (error) {
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  }

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Manage orders</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchInput value={search} onChange={handleSearchChange} placeholder="Search by order, name or email..." />
        <select
          value={statusFilter}
          onChange={(event) => handleStatusFilterChange(event.target.value)}
          className="h-11 rounded-full border border-cream-300 bg-white px-4 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All statuses" : option}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {status === "loading" ? (
          <div className="card-fb space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load orders right now." onRetry={load} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders found"
            description={search || statusFilter !== "All" ? "Try adjusting your search or filter." : "Orders will show up here once placed."}
          />
        ) : (
          <OrdersTable
            orders={pagedOrders}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onUpdateStatus={handleUpdateStatus}
            onCancel={setCancelingOrder}
            updatingId={updatingId}
          />
        )}
      </div>

      <ConfirmModal
        open={Boolean(cancelingOrder)}
        title="Cancel this order?"
        description={cancelingOrder ? `Order ${cancelingOrder.orderNumber} will be marked as cancelled.` : undefined}
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        tone="danger"
        loading={canceling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelingOrder(null)}
      />
    </section>
  );
}

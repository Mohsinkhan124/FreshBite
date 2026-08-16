"use client";

import { Ban } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import AdminTable from "@/components/admin/shared/AdminTable";
import AdminPagination from "@/components/admin/shared/AdminPagination";

const STATUS_OPTIONS = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

export default function OrdersTable({ orders, page, totalPages, onPageChange, onUpdateStatus, onCancel, updatingId }) {
  return (
    <AdminTable>
      <thead className="border-b border-cream-200 text-xs font-semibold tracking-wide text-ink-400 uppercase">
        <tr>
          <th className="px-4 py-3">Order</th>
          <th className="px-4 py-3">Customer</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cream-200">
        {orders.map((order) => {
          const locked = order.orderStatus === "Delivered" || order.orderStatus === "Cancelled";
          const isUpdating = updatingId === order._id;

          return (
            <tr key={order._id} className="transition hover:bg-cream-50">
              <td className="px-4 py-3 font-medium text-ink-900">{order.orderNumber}</td>
              <td className="px-4 py-3 text-ink-500">
                <p className="max-w-[160px] truncate text-ink-900">{order.user?.name || "Unknown"}</p>
                <p className="max-w-[160px] truncate text-xs text-ink-400">{order.user?.email}</p>
              </td>
              <td className="px-4 py-3 font-semibold text-ink-900">{formatCurrency(order.finalAmount)}</td>
              <td className="px-4 py-3 text-ink-500">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-3">
                {locked ? (
                  <OrderStatusBadge status={order.orderStatus} />
                ) : (
                  <select
                    value={order.orderStatus}
                    disabled={isUpdating}
                    onChange={(event) => onUpdateStatus(order, event.target.value)}
                    className="h-9 rounded-full border border-cream-300 bg-white px-3 text-xs font-semibold text-ink-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => onCancel(order)}
                    disabled={locked}
                    aria-label="Cancel order"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-danger disabled:opacity-30"
                  >
                    <Ban className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6} className="p-0">
            <AdminPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
          </td>
        </tr>
      </tfoot>
    </AdminTable>
  );
}

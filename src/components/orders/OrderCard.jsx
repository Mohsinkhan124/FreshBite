import { memo } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({ order }) {
  const itemCount = (order.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <Link
      href={`/orders/${order._id}`}
      className="card-fb flex items-center justify-between gap-4 p-5 transition hover:shadow-lift"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <Package className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-ink-400">
            {formatDate(order.createdAt)} · {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-ink-900">{formatCurrency(order.finalAmount)}</p>
          <OrderStatusBadge status={order.orderStatus} className="mt-1" />
        </div>
        <div className="sm:hidden">
          <OrderStatusBadge status={order.orderStatus} />
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" strokeWidth={2} />
      </div>
    </Link>
  );
}

export default memo(OrderCard);

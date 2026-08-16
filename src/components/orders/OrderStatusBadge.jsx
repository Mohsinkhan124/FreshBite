import { cn } from "@/utils/cn";

/**
 * Uses the real orderStatus enum from the backend's updateOrderStatus
 * controller — "Pending", "Preparing", "Out for Delivery", "Delivered",
 * "Cancelled" — rather than generic labels like "Processing"/"Shipped".
 */
const STATUS_STYLES = {
  Pending: "bg-cream-200 text-ink-700",
  Preparing: "bg-warning/15 text-warning",
  "Out for Delivery": "bg-brand-100 text-brand-700",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-danger/10 text-danger",
};

export default function OrderStatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap",
        STATUS_STYLES[status] || "bg-cream-200 text-ink-700",
        className,
      )}
    >
      {status}
    </span>
  );
}

import { Ban, CheckCircle2, ChefHat, Circle, PackageCheck, Truck } from "lucide-react";
import { cn } from "@/utils/cn";

const STEPS = [
  { key: "Pending", label: "Order placed", icon: Circle },
  { key: "Preparing", label: "Preparing", icon: ChefHat },
  { key: "Out for Delivery", label: "Out for delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: PackageCheck },
];

/**
 * The Order model only stores a single current `orderStatus` — there's
 * no per-step timestamp history in the backend — so this shows step
 * *completion* relative to the current status rather than a dated
 * history of when each stage happened.
 */
export default function OrderTimeline({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4">
        <Ban className="h-5 w-5 shrink-0 text-danger" strokeWidth={1.8} />
        <p className="text-sm font-medium text-danger">This order was cancelled.</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-start justify-between gap-2">
      {STEPS.map((step, index) => {
        const done = currentIndex >= 0 && index <= currentIndex;
        const isLast = index === STEPS.length - 1;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex flex-1 flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition",
                  done ? "border-brand-500 bg-brand-500 text-white" : "border-cream-300 bg-white text-ink-300",
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" strokeWidth={2} /> : <Icon className="h-4 w-4" strokeWidth={1.8} />}
              </span>
              {!isLast && (
                <span
                  className={cn("mx-1 h-0.5 flex-1", done && index < currentIndex ? "bg-brand-500" : "bg-cream-200")}
                />
              )}
            </div>
            <span className={cn("mt-2 text-xs font-medium", done ? "text-ink-900" : "text-ink-400")}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

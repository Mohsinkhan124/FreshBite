import { cn } from "@/utils/cn";

export default function StatsCard({ icon: Icon, label, value, accent = false, className }) {
  return (
    <div
      className={cn(
        "card-fb flex items-center gap-4 p-5",
        accent && "bg-gradient-to-br from-brand-500 to-brand-600 text-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          accent ? "bg-white/15 text-white" : "bg-brand-100 text-brand-600",
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className={cn("text-xs font-medium tracking-wide uppercase", accent ? "text-white/80" : "text-ink-400")}>
          {label}
        </p>
        <p className={cn("mt-1 truncate text-xl font-bold", accent ? "text-white" : "text-ink-900")}>{value}</p>
      </div>
    </div>
  );
}

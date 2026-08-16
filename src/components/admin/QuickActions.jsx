import Link from "next/link";
import { Boxes, LayoutGrid, ShoppingBag, Tag } from "lucide-react";

const ACTIONS = [
  { href: "/admin/products", label: "Manage products", icon: Boxes },
  { href: "/admin/categories", label: "Manage categories", icon: LayoutGrid },
  { href: "/admin/orders", label: "Manage orders", icon: ShoppingBag },
  { href: "/admin/coupons", label: "Manage coupons", icon: Tag },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="card-fb flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <action.icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-semibold text-ink-900">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}

import {
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  CircleUserRound,
} from "lucide-react";
import { formatDate } from "@/utils/format";

export default function PersonalInfoCard({ user }) {
  const rows = [
    {
      icon: User,
      label: "Full Name",
      value: user.name || "Not added",
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email || "Not added",
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: user.phone || "Not added",
    },
    {
      icon: CalendarDays,
      label: "Date of Birth",
      value: user.dateOfBirth
        ? formatDate(user.dateOfBirth)
        : "Not added",
    },
    {
      icon: CircleUserRound,
      label: "Gender",
      value: user.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "Not added",
    },
    {
      icon: ShieldCheck,
      label: "Account Role",
      value: user.role === "admin" ? "Admin" : "User",
    },
    {
      icon: CheckCircle2,
      label: "Account Status",
      value: "Active",
    },
    {
      icon: CalendarDays,
      label: "Joined Date",
      value: user.createdAt
        ? formatDate(user.createdAt)
        : "Not available",
    },
  ];

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">
        Personal Information
      </h2>

      <div className="mt-4 divide-y divide-cream-200">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-ink-500">
              <row.icon
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-ink-400">
                {row.label}
              </p>

              <p className="truncate text-sm font-medium text-ink-900">
                {row.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
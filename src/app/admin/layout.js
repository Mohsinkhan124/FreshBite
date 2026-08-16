import AdminRoute from "@/components/auth/AdminRoute";

/**
 * Admin shell. Dashboard sidebar and topbar land in a later feature —
 * this one wires the role guard, verified against GET /auth/admin.
 */
export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream-100">
      <AdminRoute>{children}</AdminRoute>
    </div>
  );
}

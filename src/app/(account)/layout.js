import ProtectedRoute from "@/components/auth/ProtectedRoute";

/**
 * Account shell. The profile sidebar lands in a later feature — this
 * one wires the auth route guard so /profile and /orders require a
 * session.
 */
export default function AccountLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
}

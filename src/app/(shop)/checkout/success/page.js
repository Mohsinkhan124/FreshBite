import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderSuccessContent from "@/components/checkout/OrderSuccessContent";

export const metadata = { title: "Order confirmed" };

export default function CheckoutSuccessPage() {
  return (
    <ProtectedRoute>
      <OrderSuccessContent />
    </ProtectedRoute>
  );
}

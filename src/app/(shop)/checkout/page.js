import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CheckoutPageContent from "@/components/checkout/CheckoutPageContent";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}

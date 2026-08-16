import OrderDetailContent from "@/components/orders/OrderDetailContent";

export const metadata = { title: "Order Details" };

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;
  return <OrderDetailContent orderId={id} />;
}

import { api } from "@/lib/axios";

/**
 * POST /orders — body { addressId, paymentMethod, couponCode }.
 * couponCode is optional per the controller (only applied `if (couponCode)`).
 * Returns { success, message, order }.
 */
export async function createOrder({ addressId, paymentMethod, couponCode }) {
  const payload = { addressId, paymentMethod };
  if (couponCode) payload.couponCode = couponCode;
  const { data } = await api.post("/orders", payload);
  return data;
}

/** GET /orders/my-orders — returns { success, count, orders }. */
export async function getMyOrders() {
  const { data } = await api.get("/orders/my-orders");
  return data;
}

/** GET /orders/:id — returns { success, order } (items.product populated). */
export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

/**
 * GET /orders — isAdmin. Returns { success, count, orders } (user
 * populated with name/email). No search/filter/pagination query params
 * are supported by the controller, so those are handled client-side.
 */
export async function getAllOrders() {
  const { data } = await api.get("/orders");
  return data;
}

/** PUT /orders/:id/status — isAdmin. Body { orderStatus }. Returns { success, message, order }. */
export async function updateOrderStatus(id, orderStatus) {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data;
}

/** DELETE /orders/:id — isAdmin. Cancels the order (sets orderStatus to "Cancelled"). */
export async function cancelOrder(id) {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
}

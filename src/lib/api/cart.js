import { api } from "@/lib/axios";

/** GET /cart — returns { success, count, grandTotal, cartItems }. */
export async function getCart() {
  const { data } = await api.get("/cart");
  return data;
}

/** POST /cart — body { product, quantity }, returns { success, message, cart }. */
export async function addCartItem({ product, quantity = 1 }) {
  const { data } = await api.post("/cart", { product, quantity });
  return data;
}

/** PUT /cart/:id — body { quantity }, returns { success, message, cart }. */
export async function updateCartItem(id, quantity) {
  const { data } = await api.put(`/cart/${id}`, { quantity });
  return data;
}

/** DELETE /cart/:id — returns { success, message }. */
export async function removeCartItem(id) {
  const { data } = await api.delete(`/cart/${id}`);
  return data;
}

/** DELETE /cart/clear — returns { success, message }. */
export async function clearCartItems() {
  const { data } = await api.delete("/cart/clear");
  return data;
}

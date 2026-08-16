import { api } from "@/lib/axios";

/** GET /wishlist — returns { success, count, wishlist }. */
export async function getWishlist() {
  const { data } = await api.get("/wishlist");
  return data;
}

/** POST /wishlist — body { product }, returns { success, message, wishlist }. */
export async function addWishlistItem(productId) {
  const { data } = await api.post("/wishlist", { product: productId });
  return data;
}

/** DELETE /wishlist/:id — returns { success, message }. */
export async function removeWishlistItem(id) {
  const { data } = await api.delete(`/wishlist/${id}`);
  return data;
}

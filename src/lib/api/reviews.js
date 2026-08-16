import { api } from "@/lib/axios";

/** GET /reviews/:productId — returns { success, reviews }. */
export async function getProductReviews(productId) {
  const { data } = await api.get(`/reviews/${productId}`);
  return data;
}

/** POST /reviews — returns { success, message, review }. */
export async function createReview({ productId, rating, comment }) {
  const { data } = await api.post("/reviews", { productId, rating, comment });
  return data;
}

/** PUT /reviews/:id — returns { success, message } (no updated review body). */
export async function updateReview(reviewId, { rating, comment }) {
  const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
  return data;
}

/** DELETE /reviews/:id — returns { success, message }. */
export async function deleteReview(reviewId) {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
}

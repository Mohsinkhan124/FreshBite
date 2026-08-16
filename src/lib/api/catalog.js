import { api } from "@/lib/axios";

/** GET /categories — returns the raw payload: { success, count, categories }. */
export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}

/** GET /products — returns the raw payload: { success, count, products, ... }. */
export async function getProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data;
}

/** GET /products/:id — returns the raw payload (expected: { success, product }). */
export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

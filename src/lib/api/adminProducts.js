import { api } from "@/lib/axios";

function buildProductFormData(values) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("price", values.price);
  formData.append("category", values.category);
  formData.append("stock", values.stock);
  formData.append("unit", values.unit);
  formData.append("featured", values.featured ? "true" : "false");
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }
  return formData;
}

/** POST /products (multipart, field "image") — isAdmin. Returns { success, message, product }. */
export async function createProduct(values) {
  const { data } = await api.post("/products", buildProductFormData(values));
  return data;
}

/**
 * PUT /products/:id (multipart) — isAdmin.
 * NOTE: per the given updateProduct controller, it only ever does
 * `Product.findByIdAndUpdate(req.params.id, req.body)` — it never reads
 * `req.file`, unlike createProduct. An image selected here is still
 * sent (the route wires upload.single("image")), but currently has no
 * effect until that controller is updated to process it.
 */
export async function updateProduct(id, values) {
  const { data } = await api.put(`/products/${id}`, buildProductFormData(values));
  return data;
}

/** DELETE /products/:id — isAdmin. Returns { success, message }. */
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

import { api } from "@/lib/axios";

/**
 * POST /categories (multipart) — isAdmin.
 * NOTE: the given categoryRoutes.js registers `POST "/"` twice — once
 * without upload middleware, once with. Express matches the first
 * route registered, so the upload.single("image") middleware on the
 * second registration is currently unreachable — an uploaded image may
 * not be processed until that duplicate route is fixed on the backend.
 * Sending it anyway is forward-compatible and harmless if ignored.
 */
export async function createCategory(values) {
  const formData = new FormData();
  formData.append("name", values.name);
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }
  const { data } = await api.post("/categories", formData);
  return data;
}

/** PUT /categories/:id — isAdmin. No upload middleware wired for update, so name only. */
export async function updateCategory(id, values) {
  const formData = new FormData();
  formData.append("name", values.name);
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }
  const { data } = await api.put(`/categories/${id}`, formData);
  return data;
}

/** DELETE /categories/:id — isAdmin. Returns { success, message }. */
export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

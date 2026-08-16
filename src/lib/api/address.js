import { api } from "@/lib/axios";

/** GET /address — returns { success, count, addresses }. */
export async function getAddresses() {
  const { data } = await api.get("/address");
  return data;
}

/** POST /address — body { fullName, phone, street, city, state, postalCode, country, isDefault }. */
export async function addAddress(payload) {
  const { data } = await api.post("/address", payload);
  return data;
}

/**
 * PUT /address/:id — same body shape. Also how "Select Default Address"
 * works: sending { isDefault: true } uses this same endpoint, since the
 * backend has no separate set-default route.
 */
export async function updateAddress(id, payload) {
  const { data } = await api.put(`/address/${id}`, payload);
  return data;
}

/** DELETE /address/:id — returns { success, message }. */
export async function deleteAddress(id) {
  const { data } = await api.delete(`/address/${id}`);
  return data;
}

import { api } from "@/lib/axios";

/** GET /dashboard/stats — returns { success, stats: {...} }. */
export async function getDashboardStats() {
  const { data } = await api.get("/dashboard");
  return data;
}

/** GET /dashboard/latest-orders — returns { success, analytics: [...orders] } (note: key is "analytics"). */
export async function getLatestOrders() {
  const { data } = await api.get("/analytics/latest-orders");
  return data;
}

/** GET /dashboard/latest-users — returns { success, analytics: [...users] }. */
export async function getLatestUsers() {
  const { data } = await api.get("/analytics/latest-users");
  return data;
}

import { api } from "@/lib/axios";

/** GET /analytics/monthly-sales — returns { success, analytics: [{ month, revenue, orders }] }. */
export async function getMonthlySales() {
  const { data } = await api.get("/analytics/monthly-sales");
  return data;
}

/** GET /analytics/order-status — returns { success, analytics: [{ _id: status, total }] }. */
export async function getOrderStatusAnalytics() {
  const { data } = await api.get("/analytics/order-status");
  return data;
}

/** GET /analytics/top-products — returns { success, analytics: [{ _id, name, totalSold, revenue }] }. */
export async function getTopSellingProducts() {
  const { data } = await api.get("/analytics/top-products");
  return data;
}

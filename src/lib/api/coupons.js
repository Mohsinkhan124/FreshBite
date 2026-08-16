import { api } from "@/lib/axios";

/**
 * POST /coupons/apply — body { code, totalAmount }.
 * Returns { success, message, coupon (code string), discount (percent),
 * discountAmount, finalAmount }.
 */
export async function applyCoupon({ code, totalAmount }) {
  const { data } = await api.post("/coupons/apply", { code, totalAmount });
  return data;
}

export const APP = {
  name: "FreshBite",
  tagline: "Fresh groceries, delivered in minutes",
  description:
    "Order fresh produce, pantry staples and daily essentials from FreshBite. Fast delivery, honest prices, quality you can taste.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://freshbite.app",
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fresh-bite-backend.vercel.app/api";

/** Keys used for localStorage. Namespaced to avoid collisions. */
export const STORAGE_KEYS = {
  token: "fb_token",
  refreshToken: "fb_refresh_token",
  user: "fb_user",
  cart: "fb_cart",
  wishlist: "fb_wishlist",
  lastOrder: "fb_last_order",
};

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 12,
  limitOptions: [12, 24, 48],
};

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES = [
  "/cart",
  "/wishlist",
  "/checkout",
  "/orders",
  "/profile",
  "/admin",
];

/** Routes that require an admin role. */
export const ADMIN_ROUTES = ["/admin"];

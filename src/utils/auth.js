import { STORAGE_KEYS } from "@/constants/config";

/**
 * Reads the locally-stored user object.
 *
 * There's no auth slice or login flow yet — this simply reads the
 * `fb_user` key `constants/config.js` already reserves for it, so
 * review-ownership checks (edit/delete) work correctly the moment a
 * login flow starts writing the signed-in user there.
 */
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/** Whether a session token is present. Cart/Wishlist endpoints require auth. */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(STORAGE_KEYS.token));
}

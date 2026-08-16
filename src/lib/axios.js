import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "@/constants/config";

/**
 * Shared Axios instance for every API call in the app.
 *
 * Safe to import from Server Components too: the auth-token interceptor
 * only touches `localStorage` when running in the browser, so
 * server-side fetches simply skip it and hit public endpoints
 * unauthenticated instead of throwing on a missing `window`.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/** Request interceptor — attaches the bearer token when available. */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const token = window.localStorage.getItem(STORAGE_KEYS.token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Storage unavailable — request just goes out unauthenticated.
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor — normalizes errors into a single shape
 * ({ status, message, original }) and clears a stale session on 401.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    const message =
      error.response?.data?.message || error.message || "Something went wrong. Please try again.";

    if (typeof window !== "undefined" && status === 401) {
      try {
        window.localStorage.removeItem(STORAGE_KEYS.token);
        window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
        window.localStorage.removeItem(STORAGE_KEYS.user);
      } catch {
        // Storage unavailable — nothing to clear.
      }
    }

    return Promise.reject({ status, message, original: error });
  },
);

export default api;

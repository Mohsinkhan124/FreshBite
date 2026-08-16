import { api } from "@/lib/axios";

/** POST /auth/register — body { name, email, password }, returns { success, message, user }. No token. */
export async function registerUser({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

/** POST /auth/login — body { email, password }, returns { success, message, token, user }. */
export async function loginUser({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

/** GET /auth/profile — returns { success, user }. */
export async function getProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}

/** POST /auth/forgot-password — body { email }, returns { success, message }. */
export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

/** POST /auth/reset-password/:token — body { password }, returns { success, message }. */
export async function resetPassword(token, password) {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
}

/** GET /auth/admin — protected by isAuthenticated + isAdmin; used purely as an access check. */
export async function checkAdminAccess() {
  const { data } = await api.get("/auth/admin");
  return data;
}

/** PUT /auth/profile */
/** PUT /auth/profile */
export async function updateProfile({
  name,
  email,
  phone,
  dateOfBirth,
  gender,
}) {
  const { data } = await api.put("/auth/profile", {
    name,
    email,
    phone,
    dateOfBirth,
    gender,
  });

  return data;
}

/** PUT /auth/avatar */
export async function updateAvatar(formData) {
  const { data } = await api.put("/auth/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getStoredUser, isAuthenticated } from "@/utils/auth";
import { fetchProfile, hydrateUser, setInitialized } from "@/redux/slices/authSlice";

/**
 * Runs once on mount. If a token exists, immediately hydrates
 * state.auth.user from the locally-stored user (instant — no network
 * wait) and then verifies/refreshes it against GET /auth/profile in
 * the background. If the token turns out to be invalid or expired,
 * the axios response interceptor already clears localStorage on 401,
 * and fetchProfile.rejected clears state.auth.user to match.
 */
export default function AuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated()) {
      dispatch(setInitialized());
      return;
    }
    const stored = getStoredUser();
    if (stored) dispatch(hydrateUser(stored));
    dispatch(fetchProfile());
  }, [dispatch]);

  return null;
}

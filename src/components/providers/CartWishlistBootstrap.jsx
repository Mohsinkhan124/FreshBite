"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { isAuthenticated } from "@/utils/auth";
import { fetchCart } from "@/redux/slices/cartSlice";
import { fetchWishlist } from "@/redux/slices/wishlistSlice";

/**
 * Fires once on mount to hydrate cart/wishlist from the backend when a
 * session exists. No-ops for guests — those endpoints require auth and
 * there's no login flow yet — so redux-persist just keeps showing
 * whatever was cached from the last authenticated session, if any.
 */
export default function CartWishlistBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated()) return;
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  return null;
}

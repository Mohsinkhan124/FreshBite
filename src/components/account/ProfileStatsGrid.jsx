"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Heart,
  Package,
  ShoppingCart,
  Star,
  UserRoundCheck,
} from "lucide-react";
import { getMyOrders } from "@/lib/api/orders";

export default function ProfileStatsGrid() {
  const user = useSelector((state) => state.auth?.user);

  const cartCount = useSelector(
    (state) => state.cart?.items?.length ?? 0
  );

  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length ?? 0
  );

  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getMyOrders()
      .then((data) => {
        if (!cancelled) {
          setOrderCount(
            Array.isArray(data?.orders) ? data.orders.length : 0
          );
        }
      })
      .catch(() => {
        if (!cancelled) setOrderCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Profile completion
  const profileFields = [
    user?.name,
    user?.email,
    user?.phone,
    user?.dateOfBirth,
    user?.gender,
  ];

  const completedFields = profileFields.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const cards = [
    {
      key: "orders",
      icon: Package,
      label: "Total Orders",
      value: orderCount,
    },
    {
      key: "wishlist",
      icon: Heart,
      label: "Wishlist Items",
      value: wishlistCount,
    },
    {
      key: "cart",
      icon: ShoppingCart,
      label: "Cart Items",
      value: cartCount,
    },
    {
      key: "profile",
      icon: UserRoundCheck,
      label: "Profile Complete",
      value: `${profileCompletion}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.05,
          }}
          whileHover={{ y: -3 }}
          className="card-fb flex flex-col items-center gap-2 p-5 text-center transition hover:shadow-lift"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <card.icon
              className="h-5 w-5"
              strokeWidth={1.8}
            />
          </div>

          <p className="text-xl font-bold text-ink-900">
            {card.value === null ? (
              <span className="skeleton inline-block h-6 w-8 rounded" />
            ) : (
              card.value
            )}
          </p>

          <p className="text-xs font-medium text-ink-400">
            {card.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
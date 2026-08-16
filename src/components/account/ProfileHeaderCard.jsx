"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, KeyRound, Pencil, ShieldCheck } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";
import { Camera } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadAvatar } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";

/**
 * Edit Profile has no backend endpoint (auth routes are only
 * register/login/profile/forgot-password/reset-password) — honest
 * toast rather than a fake working form. Change Password reuses the
 * real forgot-password flow, since there's no separate "change
 * password while logged in" endpoint either.
 */
 export default function ProfileHeaderCard({ user, onEdit }) {

   const dispatch = useDispatch();
const fileInputRef = useRef(null);

async function handleAvatarChange(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return toast.error("Please select an image");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    await dispatch(uploadAvatar(formData)).unwrap();
    toast.success("Avatar updated successfully");
  } catch (error) {
    toast.error(error || "Failed to upload avatar");
  }
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-fb flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:p-8 sm:text-left"
    >

      <div className="relative">
  <Avatar src={user.avatar} name={user.name} size={96} />

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg transition hover:scale-105 hover:bg-brand-600"
  >
    <Camera className="h-4 w-4" />
  </button>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleAvatarChange}
  />
</div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{user.name}</h1>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
              user.role === "admin" ? "bg-brand-500 text-white" : "bg-cream-200 text-ink-700",
            )}
          >
            <ShieldCheck className="h-3 w-3" strokeWidth={2} />
            {user.role === "admin" ? "Admin" : "User"}
          </span>
        </div>

        <p className="mt-1.5 text-sm text-ink-500">{user.email}</p>

        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-400 sm:justify-start">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          Joined {user.createdAt ? formatDate(user.createdAt) : "recently"}
        </p>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onEdit}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.8} />
          Edit Profile
        </motion.button>
        <Link
          href="/forgot-password"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cream-300 px-5 text-sm font-semibold text-ink-900 transition hover:bg-cream-100 active:scale-[0.97]"
        >
          <KeyRound className="h-4 w-4" strokeWidth={1.8} />
          Change Password
        </Link>
      </div>
    </motion.div>
  );
}

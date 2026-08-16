"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import AuthInput from "./AuthInput";

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const password = watch("password");

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const data = await resetPassword(token, values.password);
      toast.success(data?.message || "Password reset successfully");
      router.push("/login");
    } catch (error) {
      toast.error(error?.message || "Invalid or expired reset link");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl font-bold text-ink-900">Set a new password</h1>
      <p className="mt-1.5 text-sm text-ink-500">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="reset-password" className="mb-1.5 block text-sm font-medium text-ink-900">
            New password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
              strokeWidth={1.8}
            />
            <AuthInput
              id="reset-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="pl-11"
              error={errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" },
              })}
            />
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="reset-confirm-password" className="mb-1.5 block text-sm font-medium text-ink-900">
            Confirm password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
              strokeWidth={1.8}
            />
            <AuthInput
              id="reset-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="pl-11"
              error={errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </motion.div>
  );
}

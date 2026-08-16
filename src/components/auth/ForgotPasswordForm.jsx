"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, MailCheck } from "lucide-react";
import { forgotPassword } from "@/lib/api/auth";
import AuthInput from "./AuthInput";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  async function onSubmit({ email }) {
    setSubmitting(true);
    try {
      const data = await forgotPassword(email);
      toast.success(data?.message || "Reset link sent");
      setSent(true);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <MailCheck className="h-6 w-6" strokeWidth={1.6} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-ink-900">Check your email</h1>
        <p className="mt-2 text-sm text-ink-500">We sent a password reset link. It expires in 30 minutes.</p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-brand-600 transition hover:text-brand-700">
          Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-2xl font-bold text-ink-900">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-ink-500">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-ink-900">
            Email
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400"
              strokeWidth={1.8}
            />
            <AuthInput
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-11"
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
              })}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand-600 transition hover:text-brand-700">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { editProfile } from "@/redux/slices/authSlice";

export default function EditProfileModal({ open, onClose }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.status === "loading");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user && open) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.slice(0, 10)
          : "",
        gender: user.gender || "",
      });
    }
  }, [user, open, reset]);

  async function onSubmit(values) {
    try {
      await dispatch(editProfile(values)).unwrap();

      toast.success("Profile updated successfully");

      onClose();
    } catch (error) {
      toast.error(error || "Profile update failed");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name
                </label>

                <input
                  className="h-12 w-full rounded-xl border px-4 outline-none focus:border-brand-500"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  className="h-12 w-full rounded-xl border px-4 outline-none focus:border-brand-500"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="03001234567"
                  className="h-12 w-full rounded-xl border px-4 outline-none focus:border-brand-500"
                  {...register("phone")}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date of Birth
                </label>

                <input
                  type="date"
                  className="h-12 w-full rounded-xl border px-4 outline-none focus:border-brand-500"
                  {...register("dateOfBirth")}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Gender
                </label>

                <select
                  className="h-12 w-full rounded-xl border bg-white px-4 outline-none focus:border-brand-500"
                  {...register("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-brand-500 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
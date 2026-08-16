"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { useDialogA11y } from "@/hooks/useDialogA11y";

export default function AddressFormModal({ open, onClose, onSubmit, submitting, initialValues }) {
  const panelRef = useRef(null);
  useDialogA11y(open, onClose, panelRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    if (open) {
      reset(
        initialValues || {
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "PAKISTAN",
          isDefault: false,
        },
      );
    }
  }, [open, initialValues, reset]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={initialValues ? "Edit address" : "Add address"}
            className="fixed inset-x-0 top-1/2 z-50 mx-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">{initialValues ? "Edit address" : "Add address"}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.fullName}>
                  <AuthInput error={errors.fullName} {...register("fullName", { required: "Full name is required" })} />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <AuthInput error={errors.phone} {...register("phone", { required: "Phone is required" })} />
                </Field>
              </div>

              <Field label="Street address" error={errors.street}>
                <AuthInput error={errors.street} {...register("street", { required: "Street is required" })} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" error={errors.city}>
                  <AuthInput error={errors.city} {...register("city", { required: "City is required" })} />
                </Field>
                <Field label="State" error={errors.state}>
                  <AuthInput error={errors.state} {...register("state", { required: "State is required" })} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Postal code" error={errors.postalCode}>
                  <AuthInput
                    error={errors.postalCode}
                    {...register("postalCode", { required: "Postal code is required" })}
                  />
                </Field>
                <Field label="Country">
                  <AuthInput {...register("country")} />
                </Field>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-900">
                <input type="checkbox" className="h-4 w-4 accent-brand-500" {...register("isDefault")} />
                Set as default address
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : initialValues ? "Save changes" : "Add address"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-900">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger">{error.message}</p>}
    </div>
  );
}

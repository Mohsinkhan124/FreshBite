"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { useDialogA11y } from "@/hooks/useDialogA11y";

export default function CategoryFormModal({ open, onClose, onSubmit, submitting, initialValues }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const panelRef = useRef(null);
  useDialogA11y(open, onClose, panelRef);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const imageFiles = watch("image");
  const isEditing = Boolean(initialValues);

  useEffect(() => {
    if (open) {
      reset({ name: initialValues?.name || "" });
      setPreviewUrl(initialValues?.image || null);
    }
  }, [open, initialValues, reset]);

  useEffect(() => {
    const file = imageFiles?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFiles]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleFormSubmit(values) {
    onSubmit({ ...values, image: values.image?.[0] });
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
            aria-label={isEditing ? "Edit category" : "Add category"}
            className="fixed inset-x-0 top-1/2 z-50 mx-auto w-[calc(100%-2rem)] max-w-sm -translate-y-1/2 rounded-3xl bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">{isEditing ? "Edit category" : "Add category"}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-100"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-4">
              <div>
  <label className="mb-1.5 block text-sm font-medium text-ink-900">
    Category image
  </label>

  <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 transition hover:border-brand-300">
    {previewUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl}
        alt="Preview"
        className="h-full w-full object-cover"
      />
    ) : (
      <ImagePlus className="h-5 w-5 text-ink-400" strokeWidth={1.6} />
    )}

    <input
      type="file"
      accept="image/*"
      className="sr-only"
      {...register("image")}
    />
  </label>

  {isEditing && (
    <p className="mt-2 text-xs text-ink-500">
      Select a new image only if you want to replace the current one.
    </p>
  )}
</div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-900">Name</label>
                <AuthInput error={errors.name} {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : isEditing ? "Save changes" : "Add category"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

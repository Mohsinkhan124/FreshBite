"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import AuthInput from "@/components/auth/AuthInput";
import { useDialogA11y } from "@/hooks/useDialogA11y";

export default function ProductFormModal({ open, onClose, onSubmit, submitting, initialValues, categories }) {
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

  useEffect(() => {
    if (open) {
      reset(
        initialValues
          ? {
            name: initialValues.name,
            description: initialValues.description,
            price: initialValues.price,
            category: initialValues.category?._id || initialValues.category || "",
            stock: initialValues.stock,
            unit: initialValues.unit || "kg",
            featured: Boolean(initialValues.featured),
          }
          : {
            name: "",
            description: "",
            price: "",
            category: "",
            stock: "",
            unit: "kg",
            featured: false,
          },
      );
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
            aria-label={initialValues ? "Edit product" : "Add product"}
            className="fixed inset-x-0 top-1/2 z-50 mx-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">{initialValues ? "Edit product" : "Add product"}</h2>
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
                <label className="mb-1.5 block text-sm font-medium text-ink-900">Product image</label>
                <label className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 transition hover:border-brand-300">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ink-400" strokeWidth={1.6} />
                  )}
                  <input type="file" accept="image/*" className="sr-only" {...register("image")} />
                </label>
                {initialValues && (
                  <p className="mt-1.5 text-xs text-ink-400">
                    Uploading a new image here currently has no effect until the backend&apos;s update endpoint
                    processes it (only create does today).
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-900">Name</label>
                <AuthInput error={errors.name} {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-900">Description</label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="mt-1.5 text-xs text-danger">{errors.description.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-900">Price</label>
                  <AuthInput
                    type="number"
                    step="0.01"
                    min="0"
                    error={errors.price}
                    {...register("price", { required: "Price is required", min: { value: 0, message: "Must be 0 or more" } })}
                  />
                  {errors.price && <p className="mt-1.5 text-xs text-danger">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-900">Stock</label>
                  <AuthInput
                    type="number"
                    min="0"
                    error={errors.stock}
                    {...register("stock", { required: "Stock is required", min: { value: 0, message: "Must be 0 or more" } })}
                  />
                  {errors.stock && <p className="mt-1.5 text-xs text-danger">{errors.stock.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-900">
                  Unit
                </label>

                <select
                  className="h-12 w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                  {...register("unit")}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="litre">Litre</option>
                  <option value="ml">Millilitre (ml)</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-900">Category</label>
                <select
                  className="h-12 w-full rounded-2xl border border-cream-300 bg-cream-50 px-4 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1.5 text-xs text-danger">{errors.category.message}</p>}
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-900">
                <input type="checkbox" className="h-4 w-4 accent-brand-500" {...register("featured")} />
                Featured product
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving..." : initialValues ? "Save changes" : "Add product"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

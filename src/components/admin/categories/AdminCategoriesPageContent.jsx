"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LayoutGrid, Plus } from "lucide-react";
import { getCategories } from "@/lib/api/catalog";
import { createCategory, deleteCategory, updateCategory } from "@/lib/api/adminCategories";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import AdminSearchInput from "@/components/admin/shared/AdminSearchInput";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import CategoriesTable from "./CategoriesTable";
import CategoryFormModal from "./CategoryFormModal";

export default function AdminCategoriesPageContent() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data?.categories) ? data.categories : []);
      setStatus("succeeded");
    } catch (error) {
      toast.error(error?.message || "We couldn't load categories");
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // getAllCategories has no search/query params server-side, so filter locally.
  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((category) => category.name?.toLowerCase().includes(term));
  }, [categories, search]);

  function openAddModal() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setSubmitting(true);
    try {
      if (editingCategory) {
        const data = await updateCategory(editingCategory._id, values);
        toast.success(data?.message || "Category updated successfully");
      } else {
        const data = await createCategory(values);
        toast.success(data?.message || "Category created successfully");
      }
      setFormOpen(false);
      await load();
    } catch (error) {
      toast.error(error?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingCategory) return;
    setDeleting(true);
    try {
      const data = await deleteCategory(deletingCategory._id);
      toast.success(data?.message || "Category deleted successfully");
      setDeletingCategory(null);
      await load();
    } catch (error) {
      toast.error(error?.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">Manage categories</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add category
        </button>
      </div>

      <div className="mt-6">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
      </div>

      <div className="mt-6">
        {status === "loading" ? (
          <div className="card-fb space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load categories right now." onRetry={load} />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No categories found"
            description={search ? "Try a different search term." : "Add your first category to get started."}
          />
        ) : (
          <CategoriesTable categories={filteredCategories} onEdit={openEditModal} onDelete={setDeletingCategory} />
        )}
      </div>

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        initialValues={editingCategory}
      />

      <ConfirmModal
        open={Boolean(deletingCategory)}
        title="Delete this category?"
        description={deletingCategory ? `"${deletingCategory.name}" will be permanently removed.` : undefined}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </section>
  );
}

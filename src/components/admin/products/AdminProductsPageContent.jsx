"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Boxes } from "lucide-react";
import { getCategories, getProducts } from "@/lib/api/catalog";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api/adminProducts";
import { PAGINATION } from "@/constants/config";
import Breadcrumb from "@/components/common/Breadcrumb";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import AdminSearchInput from "@/components/admin/shared/AdminSearchInput";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import ProductsTable from "./ProductsTable";
import ProductFormModal from "./ProductFormModal";

export default function AdminProductsPageContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data?.categories) ? data.categories : []))
      .catch(() => setCategories([]));
  }, []);

  async function load() {
    setStatus("loading");
    try {
      const data = await getProducts({ search: search || undefined, page, limit: PAGINATION.defaultLimit });
      setProducts(Array.isArray(data?.products) ? data.products : []);
      setTotalPages(Number(data?.totalPages) || 1);
      setStatus("succeeded");
    } catch (error) {
      toast.error(error?.message || "We couldn't load products");
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  function handleSearchChange(value) {
    setPage(1);
    setSearch(value);
  }

  function openAddModal() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setSubmitting(true);
    try {
      if (editingProduct) {
        const data = await updateProduct(editingProduct._id, values);
        toast.success(data?.message || "Product updated successfully");
      } else {
        const data = await createProduct(values);
        toast.success(data?.message || "Product created successfully");
      }
      setFormOpen(false);
      await load();
    } catch (error) {
      toast.error(error?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      const data = await deleteProduct(deletingProduct._id);
      toast.success(data?.message || "Product deleted successfully");
      setDeletingProduct(null);
      if (products.length === 1 && page > 1) {
        setPage((value) => value - 1);
      } else {
        await load();
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Products" }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">Manage products</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex h-11 items-center gap-2 rounded-full bg-brand-500 px-5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add product
        </button>
      </div>

      <div className="mt-6">
        <AdminSearchInput value={search} onChange={handleSearchChange} placeholder="Search products..." />
      </div>

      <div className="mt-6">
        {status === "loading" ? (
          <div className="card-fb space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load products right now." onRetry={load} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No products found"
            description={search ? "Try a different search term." : "Add your first product to get started."}
          />
        ) : (
          <ProductsTable
            products={products}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onEdit={openEditModal}
            onDelete={setDeletingProduct}
          />
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
        initialValues={editingProduct}
        categories={categories}
      />

      <ConfirmModal
        open={Boolean(deletingProduct)}
        title="Delete this product?"
        description={deletingProduct ? `"${deletingProduct.name}" will be permanently removed.` : undefined}
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProduct(null)}
      />
    </section>
  );
}

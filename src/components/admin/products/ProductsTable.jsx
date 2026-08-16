"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import ImageWithFallback from "@/components/home/ImageWithFallback";
import AdminTable from "@/components/admin/shared/AdminTable";
import AdminPagination from "@/components/admin/shared/AdminPagination";

export default function ProductsTable({ products, page, totalPages, onPageChange, onEdit, onDelete }) {
  return (
    <AdminTable>
      <thead className="border-b border-cream-200 text-xs font-semibold tracking-wide text-ink-400 uppercase">
        <tr>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cream-200">
        {products.map((product) => (
          <tr key={product._id} className="transition hover:bg-cream-50">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <ImageWithFallback src={product.image} alt={product.name} />
                </div>
                <span className="max-w-[200px] truncate font-medium text-ink-900">{product.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-ink-500">{product.category?.name || "—"}</td>
            <td className="px-4 py-3 font-semibold text-ink-900">
              {formatCurrency(product.price)} / {product.unit}
            </td>
            <td className="px-4 py-3 text-ink-500">
              {product.stock} {product.unit}
            </td>
            <td className="px-4 py-3">
              {product.featured && (
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand-700 uppercase">
                  Featured
                </span>
              )}
              {product.stock <= 0 && (
                <span className="ml-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-danger uppercase">
                  Out of stock
                </span>
              )}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  aria-label="Edit product"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  aria-label="Delete product"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6} className="p-0">
            <AdminPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
          </td>
        </tr>
      </tfoot>
    </AdminTable>
  );
}

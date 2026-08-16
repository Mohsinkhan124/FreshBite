"use client";

import { Pencil, Trash2 } from "lucide-react";
import ImageWithFallback from "@/components/home/ImageWithFallback";
import AdminTable from "@/components/admin/shared/AdminTable";

export default function CategoriesTable({ categories, onEdit, onDelete }) {
  return (
    <AdminTable>
      <thead className="border-b border-cream-200 text-xs font-semibold tracking-wide text-ink-400 uppercase">
        <tr>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-cream-200">
        {categories.map((category) => (
          <tr key={category._id} className="transition hover:bg-cream-50">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <ImageWithFallback src={category.image} alt={category.name} />
                </div>
                <span className="font-medium text-ink-900">{category.name}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  aria-label="Edit category"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(category)}
                  aria-label="Delete category"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  );
}

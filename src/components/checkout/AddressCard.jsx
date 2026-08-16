"use client";

import { Check, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function AddressCard({ address, selected, onSelect, onEdit, onDelete, onSetDefault, deleting }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-4 transition",
        selected ? "border-brand-500 bg-brand-50" : "border-cream-300 bg-white hover:border-brand-300",
        deleting && "pointer-events-none opacity-50",
      )}
    >
      <button type="button" onClick={onSelect} className="flex items-start justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
              selected ? "border-brand-500 bg-brand-500 text-white" : "border-cream-300",
            )}
          >
            {selected && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <p className="text-sm font-semibold text-ink-900">{address.fullName}</p>
        </div>
        {address.isDefault && (
          <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-700 uppercase">
            Default
          </span>
        )}
      </button>

      <button type="button" onClick={onSelect} className="pl-7 text-left">
        <p className="flex items-start gap-1.5 text-sm text-ink-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" strokeWidth={1.8} />
          {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
        </p>
        <p className="mt-0.5 text-xs text-ink-400">{address.phone}</p>
      </button>

      <div className="mt-1 flex flex-wrap items-center gap-4 pl-7">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-semibold text-ink-500 transition hover:text-brand-600"
        >
          <Pencil className="h-3 w-3" strokeWidth={2} />
          Edit
        </button>
        {!address.isDefault && (
          <button
            type="button"
            onClick={onSetDefault}
            className="flex items-center gap-1 text-xs font-semibold text-ink-500 transition hover:text-brand-600"
          >
            <Star className="h-3 w-3" strokeWidth={2} />
            Set as default
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex items-center gap-1 text-xs font-semibold text-ink-500 transition hover:text-danger"
        >
          <Trash2 className="h-3 w-3" strokeWidth={2} />
          {deleting ? "Removing..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

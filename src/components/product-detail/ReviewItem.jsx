"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import RatingStars from "@/components/common/RatingStars";
import { formatDate } from "@/utils/format";

export default function ReviewItem({ review, isOwner, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="card-fb p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={review.user?.avatar} name={review.user?.name} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{review.user?.name || "Anonymous"}</p>
            <p className="text-xs text-ink-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="flex shrink-0 items-center gap-1">
            {confirmingDelete ? (
              <>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-full bg-danger px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-danger/90"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-500 transition hover:bg-cream-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  aria-label="Edit review"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-brand-600"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  aria-label="Delete review"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-cream-100 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <RatingStars rating={review.rating} className="mt-3" />
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{review.comment}</p>
    </div>
  );
}

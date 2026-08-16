"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export default function ReviewForm({ initialRating = 0, initialComment = "", submitting, isEditing, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    setRating(initialRating);
    setComment(initialComment);
  }, [initialRating, initialComment]);

  function handleSubmit(event) {
    event.preventDefault();
    if (rating < 1 || !comment.trim()) return;
    onSubmit({ rating, comment: comment.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm font-semibold text-ink-900">{isEditing ? "Update your review" : "Write a review"}</p>

      <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const active = value <= (hoverRating || rating);
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              aria-label={`Rate ${value} out of 5`}
              className="p-0.5"
            >
              <Star
                className={cn("h-6 w-6 transition", active ? "fill-warning text-warning" : "text-cream-300")}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      <label htmlFor="review-comment" className="sr-only">
        Your review
      </label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Share your experience with this product..."
        rows={4}
        required
        className="w-full resize-none rounded-2xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || rating < 1 || !comment.trim()}
          className="h-11 flex-1 rounded-full bg-brand-500 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : isEditing ? "Update review" : "Submit review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-full border border-cream-300 px-4 text-sm font-semibold text-ink-700 transition hover:bg-cream-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

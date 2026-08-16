"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import { getStoredUser } from "@/utils/auth";
import { createReview, deleteReview, updateReview } from "@/lib/api/reviews";
import EmptyState from "@/components/home/EmptyState";
import RatingStars from "@/components/common/RatingStars";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

export default function ReviewsSection({ productId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // No auth slice/login flow yet — see utils/auth.js. `currentUser` is
  // `null` until a login feature starts writing to the `fb_user` key.
  const currentUser = useMemo(() => getStoredUser(), []);
  const myReview = currentUser ? reviews.find((review) => review.user?._id === currentUser._id) : null;
  const activeReview = editingReview || myReview || null;

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length : 0;

  async function handleSubmit({ rating, comment }) {
    setSubmitting(true);
    try {
      if (activeReview) {
        await updateReview(activeReview._id, { rating, comment });
        setReviews((previous) =>
          previous.map((review) =>
            review._id === activeReview._id
              ? { ...review, rating, comment, updatedAt: new Date().toISOString() }
              : review,
          ),
        );
        toast.success("Review updated successfully");
        setEditingReview(null);
      } else {
        const data = await createReview({ productId, rating, comment });
        if (data?.review) {
          setReviews((previous) => [data.review, ...previous]);
        }
        toast.success(data?.message || "Review added successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(review) {
    try {
      await deleteReview(review._id);
      setReviews((previous) => previous.filter((item) => item._id !== review._id));
      if (editingReview?._id === review._id) setEditingReview(null);
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Be the first to share your thoughts on this product."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                isOwner={Boolean(currentUser) && currentUser._id === review.user?._id}
                onEdit={() => setEditingReview(review)}
                onDelete={() => handleDelete(review)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="card-fb sticky top-24 p-6">
          <div className="flex items-center gap-2">
            <RatingStars rating={averageRating} size="md" />
            <span className="text-sm font-semibold text-ink-900">{averageRating.toFixed(1)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-400">
            Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>

          <div className="mt-6 border-t border-cream-200 pt-6">
            {currentUser ? (
              <ReviewForm
                key={activeReview?._id || "new"}
                initialRating={activeReview?.rating ?? 0}
                initialComment={activeReview?.comment ?? ""}
                submitting={submitting}
                isEditing={Boolean(activeReview)}
                onSubmit={handleSubmit}
                onCancel={editingReview ? () => setEditingReview(null) : undefined}
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-ink-500">Log in to write a review.</p>
                <Link
                  href="/login"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

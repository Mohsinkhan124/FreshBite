import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Pure display component for a star rating, optionally with a review
 * count. Used on the product detail page and in individual reviews.
 */
export default function RatingStars({ rating = 0, totalReviews, size = "sm", className }) {
  const rounded = Math.round(rating || 0);
  const starSize = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(starSize, index < rounded ? "fill-warning text-warning" : "text-cream-300")}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {typeof totalReviews === "number" && (
        <span className="text-xs text-ink-400">{totalReviews > 0 ? `(${totalReviews})` : "No reviews yet"}</span>
      )}
    </div>
  );
}

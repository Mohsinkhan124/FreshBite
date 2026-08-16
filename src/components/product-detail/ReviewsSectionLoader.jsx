import { getProductReviews } from "@/lib/api/reviews";
import ErrorState from "@/components/home/ErrorState";
import ReviewsSection from "./ReviewsSection";

export default async function ReviewsSectionLoader({ productId }) {
  let reviews = [];
  let hasError = false;

  try {
    const data = await getProductReviews(productId);
    reviews = Array.isArray(data?.reviews) ? data.reviews : [];
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load reviews right now." />;
  }

  return <ReviewsSection productId={productId} initialReviews={reviews} />;
}

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import RatingStars from "@/components/common/RatingStars";

export default function ProductInfo({ product }) {
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div>
      {product.category?.name && (
        <Link
          href={`/products?category=${product.category._id}`}
          className="text-xs font-semibold tracking-wide text-brand-600 uppercase transition hover:text-brand-700"
        >
          {product.category.name}
        </Link>
      )}

      <h1 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{product.name}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <RatingStars rating={product.averageRating} totalReviews={product.totalReviews} size="md" />
        {product.featured && (
          <span className="rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-brand">
            Featured
          </span>
        )}
      </div>

      <p className="mt-5 text-3xl font-bold text-ink-900">
        {formatCurrency(product.price)} / {product.unit}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium">
        {inStock ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={2} />
            <span className="text-success">
  In stock ({product.stock} {product.unit} available)
</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-danger" strokeWidth={2} />
            <span className="text-danger">Out of stock</span>
          </>
        )}
      </div>

      {product.description && <p className="mt-6 leading-relaxed text-ink-500">{product.description}</p>}
    </div>
  );
}

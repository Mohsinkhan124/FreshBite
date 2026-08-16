import { memo } from "react";
import Link from "next/link";
import ImageWithFallback from "./ImageWithFallback";

function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories?category=${category._id}`}
      className="group card-fb flex flex-col items-center gap-3 overflow-hidden p-5 text-center transition hover:shadow-lift"
    >
      <div className="h-30 w-30  rounded-2xl bg-cream-100">
        <ImageWithFallback src={category.image} alt={category.name} />
      </div>
      <span className="text-sm font-semibold text-ink-900 transition group-hover:text-brand-600">
        {category.name}
      </span>
    </Link>
  );
}

export default memo(CategoryCard);

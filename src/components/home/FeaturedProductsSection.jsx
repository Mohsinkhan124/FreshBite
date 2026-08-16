import { Suspense } from "react";
import Reveal from "./Reveal";
import FeaturedProductsGrid from "./FeaturedProductsGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function FeaturedProductsSection() {
  return (
    <section className="container-fb py-16 lg:py-20">
      <Reveal>
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-wide text-brand-600 uppercase">Handpicked</span>
          <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Featured products</h2>
        </div>
      </Reveal>

      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProductsGrid />
      </Suspense>
    </section>
  );
}

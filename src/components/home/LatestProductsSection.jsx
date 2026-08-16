import { Suspense } from "react";
import Reveal from "./Reveal";
import LatestProductsGrid from "./LatestProductsGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function LatestProductsSection() {
  return (
    <section className="bg-cream-100/60 py-16 lg:py-20">
      <div className="container-fb">
        <Reveal>
          <div className="mb-10">
            <span className="text-xs font-semibold tracking-wide text-brand-600 uppercase">Just in</span>
            <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Latest products</h2>
          </div>
        </Reveal>

        <Suspense fallback={<ProductGridSkeleton />}>
          <LatestProductsGrid />
        </Suspense>
      </div>
    </section>
  );
}

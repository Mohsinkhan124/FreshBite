import { Suspense } from "react";
import Reveal from "./Reveal";
import CategoriesGrid from "./CategoriesGrid";
import CategoriesSkeleton from "./CategoriesSkeleton";

export default function CategoriesSection() {
  return (
    <section className="container-fb py-12 lg:py-15">
      <Reveal>
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-wide text-brand-600 uppercase">Browse</span>
          <h2 className="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">Shop by category</h2>
        </div>
      </Reveal>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesGrid />
      </Suspense>
    </section>
  );
}

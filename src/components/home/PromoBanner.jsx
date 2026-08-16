import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

export default function PromoBanner() {
  return (
    <section className="container-fb py-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 px-8 py-14 text-center shadow-brand sm:px-16">
          <div className="pointer-events-none absolute -top-12 -right-12 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10" />

          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Limited time
          </span>

          <h2 className="relative mt-5 text-3xl font-bold text-white sm:text-4xl">
            Free delivery on your first order
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
            No promo code needed — it&apos;s applied automatically at checkout on your first purchase.
          </p>

          <Link
            href="/products"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-700 shadow-lift transition hover:bg-cream-50"
          >
            Start shopping
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

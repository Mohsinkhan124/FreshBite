"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { APP } from "@/constants/config";
import HeroVisual from "./HeroVisual";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream-50 to-cream-50">
      <div className="container-fb grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase">
            <ShoppingBasket className="h-3.5 w-3.5" strokeWidth={2} />
            Delivered in minutes
          </span>

          <h1 className="mt-6 text-4xl leading-[1.1] font-bold text-ink-900 sm:text-5xl lg:text-6xl">
            {APP.tagline}
          </h1>

          <p className="mt-5 max-w-lg text-base text-ink-500 sm:text-lg">{APP.description}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
            >
              Shop now
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={2} />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition hover:border-brand-300 hover:text-brand-600"
            >
              Explore categories
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
            <span>
              <strong className="text-ink-900">30 min</strong> avg. delivery
            </span>
            <span>
              <strong className="text-ink-900">100%</strong> quality checked
            </span>
            <span>
              <strong className="text-ink-900">24/7</strong> support
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

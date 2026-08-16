"use client";

import { motion } from "framer-motion";
import { Apple, Beef, Pizza } from "lucide-react";
import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg">

      {/* Background Blob */}
      <svg
        viewBox="0 0 4 00 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroBlob" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.89 0.1 150)" />
            <stop offset="100%" stopColor="oklch(0.97 0.03 150)" />
          </linearGradient>
        </defs>

        <path
          fill="url(#heroBlob)"
          d="M338.5 120Q370 190 340 260Q310 330 230 350Q150 370 90 320Q30 270 40 190Q50 110 120 60Q190 10 265 40Q307 50 338.5 120Z"
        />
      </svg>

      {/* Center Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Image
          src="/images/home.png"
          alt="Fresh groceries"
          width={800}
          height={500}
          priority
          className="object-contain drop-shadow-2xl"
        />
      </div>

      {/* Floating Chips */}
      <FloatingChip
        icon={Apple}
        label="Fresh Fruits"
        className="top-6 left-2"
        delay={0}
      />

      <FloatingChip
        icon={Pizza}
        label="Fast Food"
        className="top-1/2 right-0 -translate-y-1/2"
        delay={0.3}
      />

      <FloatingChip
        icon={Beef}
        label="Groceries"
        className="bottom-6 left-10"
        delay={0.6}
      />
    </div>
  );
}

function FloatingChip({ icon: Icon, label, className, delay }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`glass absolute z-20 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lift ${className}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </div>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
    </motion.div>
  );
}
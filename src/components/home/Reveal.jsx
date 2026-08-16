"use client";

import { motion } from "framer-motion";

/**
 * Scroll-triggered fade + slide-up wrapper.
 *
 * A Client Component so it can hold the Framer Motion viewport hook, but
 * `children` is free to be server-rendered content passed down from a
 * parent Server Component — that composition is what keeps the data
 * fetching sections themselves server-only.
 */
export default function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Renders `src` as a plain <img> (backend image hosts aren't known/
 * allow-listed for next/image yet) and falls back to a themed
 * placeholder when `src` is empty or fails to load.
 */
export default function ImageWithFallback({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-cream-200 text-brand-300",
          className,
        )}
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "h-full w-full object-fill transform transition-all duration-600 ease-out group-hover:scale-125",
        className
      )}
    />
  );
}

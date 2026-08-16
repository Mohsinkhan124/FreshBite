"use client";

import { useState } from "react";
import ImageWithFallback from "@/components/home/ImageWithFallback";
import { cn } from "@/utils/cn";

/**
 * The product schema only exposes a single `image` field (no gallery
 * array), so `images` defensively supports a future multi-image field
 * but falls back to the one real image — no fake extra photos.
 */
export default function ProductGallery({ images, alt }) {
  const gallery = images.length > 0 ? images : [""];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState(null);
  const activeImage = gallery[activeIndex];

  function handleMouseMove(event) {
    if (!activeImage) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomStyle({ backgroundImage: `url(${activeImage})`, backgroundPosition: `${x}% ${y}%` });
  }

  return (
    <div>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomStyle(null)}
        className="relative aspect-square overflow-hidden rounded-3xl bg-cream-100"
      >
        <ImageWithFallback src={activeImage} alt={alt} />
        {activeImage && (
          <div
            aria-hidden="true"
            style={zoomStyle ? { ...zoomStyle, backgroundSize: "200%", opacity: 1 } : { opacity: 0 }}
            className="pointer-events-none absolute inset-0 hidden bg-no-repeat transition-opacity duration-150 lg:block"
          />
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "h-20 w-20 overflow-hidden rounded-2xl border-2 bg-cream-100 transition",
                index === activeIndex ? "border-brand-500" : "border-transparent hover:border-cream-300",
              )}
            >
              <ImageWithFallback src={image} alt={`${alt} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function Avatar({ src, name, size = 40 }) {
  const [failed, setFailed] = useState(false);

  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const imageSrc =
    typeof src === "string"
      ? src
      : src?.url;

  if (!imageSrc || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={name || "Avatar"}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
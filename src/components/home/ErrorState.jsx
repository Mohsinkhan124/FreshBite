"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Retry re-runs the server request by asking Next.js to refresh the
 * route by default. Pass `onRetry` to retry a client-side fetch
 * instead (router.refresh() only affects Server Component data, so it
 * can't re-run a useEffect-based fetch in a Client Component).
 */
export default function ErrorState({ title = "Something went wrong", description, className, onRetry }) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  function handleRetry() {
    setRetrying(true);
    if (onRetry) {
      Promise.resolve(onRetry()).finally(() => setRetrying(false));
    } else {
      router.refresh();
      window.setTimeout(() => setRetrying(false), 1000);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-danger/20 bg-danger/5 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-500">{description}</p>}
      <button
        type="button"
        onClick={handleRetry}
        disabled={retrying}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:opacity-60"
      >
        <RotateCw className={cn("h-4 w-4", retrying && "animate-spin")} strokeWidth={1.8} />
        Try again
      </button>
    </div>
  );
}

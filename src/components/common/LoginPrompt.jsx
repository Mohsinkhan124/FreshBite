import Link from "next/link";
import { LogIn } from "lucide-react";
import { cn } from "@/utils/cn";

export default function LoginPrompt({ message = "Log in to continue.", className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cream-300 bg-cream-50 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-ink-400">
        <LogIn className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <p className="max-w-sm text-sm text-ink-500">{message}</p>
      <Link
        href="/login"
        className="mt-1 inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
      >
        Log in
      </Link>
    </div>
  );
}

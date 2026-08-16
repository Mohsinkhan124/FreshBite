import Link from "next/link";
import { KeyRound } from "lucide-react";

export const metadata = { title: "Reset password" };

/**
 * Fallback for anyone who lands on /reset-password without a token
 * (the real reset link from the backend includes one, at
 * /reset-password/[token]).
 */
export default function ResetPasswordFallbackPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-ink-400">
        <KeyRound className="h-6 w-6" strokeWidth={1.6} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-ink-900">Reset your password</h1>
      <p className="mt-2 text-sm text-ink-500">
        Use the link we emailed you to reset your password. If you need a new one, request it below.
      </p>
      <Link
        href="/forgot-password"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
      >
        Request a new link
      </Link>
    </div>
  );
}

import Link from "next/link";
import { APP } from "@/constants/config";

/**
 * Centered auth shell — split-panel branding is added in Feature 11.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream-100 px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-bold text-brand-600">
        {APP.name}
      </Link>
      <div className="w-full max-w-md card-fb p-8">{children}</div>
    </div>
  );
}

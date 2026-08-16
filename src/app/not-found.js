import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="container-fb flex min-h-dvh flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="font-display text-7xl font-bold text-brand-500">404</p>
      <h1 className="text-2xl font-semibold sm:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-md text-ink-500">
        The link may be broken, or the page may have been moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
      >
        Back to home
      </Link>
    </main>
  );
}

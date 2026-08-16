"use client";

export default function GlobalError({ error, reset }) {
  return (
    <main className="container-fb flex min-h-dvh flex-col items-center justify-center gap-6 py-24 text-center">
      <h1 className="text-2xl font-semibold sm:text-3xl">Something went wrong</h1>
      <p className="max-w-md text-ink-500">
        An unexpected error occurred. Try again, or head back home.
      </p>
      {process.env.NODE_ENV !== "production" && error?.message ? (
        <pre className="max-w-xl overflow-auto rounded-xl bg-cream-100 p-4 text-left text-xs text-ink-700">
          {error.message}
        </pre>
      ) : null}
      <button
        onClick={reset}
        className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
      >
        Try again
      </button>
    </main>
  );
}

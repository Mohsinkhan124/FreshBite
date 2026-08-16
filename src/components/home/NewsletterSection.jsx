"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import Reveal from "./Reveal";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      toast.success("Subscribed! Fresh deals are on their way to your inbox.");
      setEmail("");
      setSubmitting(false);
    }, 500);
  }

  return (
    <section className="container-fb py-16 lg:py-20">
      <Reveal>
        <div className="card-fb mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-12 text-center sm:px-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <Mail className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Get fresh deals in your inbox</h2>
          <p className="max-w-md text-sm text-ink-500">
            Join our newsletter for weekly discounts, new arrivals and seasonal produce picks.
          </p>

          <form onSubmit={handleSubmit} className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="home-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="home-newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-full border border-cream-300 bg-cream-50 px-5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={submitting}
              className="h-12 shrink-0 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600 disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}

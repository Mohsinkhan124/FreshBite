"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { APP } from "@/constants/config";
import { CONTACT_INFO, FOOTER_CATEGORIES, FOOTER_QUICK_LINKS, SOCIAL_LINKS } from "@/constants/navigation";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_PATTERN.test(trimmed)) {
      toast.error("Enter a valid email address");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success("You're subscribed! Watch your inbox for fresh deals.");
      setEmail("");
      setSubmitting(false);
    }, 500);
  }

  return (
    <footer className="mt-auto border-t border-cream-200 bg-cream-100">
      <div className="container-fb grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-2xl font-bold text-brand-600">
            {APP.name}
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">{APP.description}</p>

          <div className="mt-6 flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 bg-white text-ink-700 transition hover:border-brand-300 hover:bg-brand-500 hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-ink-900 uppercase">Quick links</h3>
          <ul className="mt-5 space-y-3">
            {FOOTER_QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-500 transition hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-ink-900 uppercase">Categories</h3>
          <ul className="mt-5 space-y-3">
            {FOOTER_CATEGORIES.map((category) => (
              <li key={category.label}>
                <Link href={category.href} className="text-sm text-ink-500 transition hover:text-brand-600">
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-ink-900 uppercase">Stay in the loop</h3>
          <p className="mt-5 text-sm text-ink-500">
            Subscribe for weekly deals, seasonal produce drops and early access to sales.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex items-center gap-2">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full min-w-0 rounded-full border border-cream-300 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand transition hover:bg-brand-600 disabled:opacity-60"
            >
              <Send className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </form>

          <ul className="mt-6 space-y-3 text-sm text-ink-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
              {CONTACT_INFO.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
              <a href={`tel:${CONTACT_INFO.phone}`} className="transition hover:text-brand-600">
                {CONTACT_INFO.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-500" strokeWidth={1.8} />
              <a href={`mailto:${CONTACT_INFO.email}`} className="transition hover:text-brand-600">
                {CONTACT_INFO.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-200">
        <div className="container-fb py-6 text-center text-xs text-ink-400">
          © {new Date().getFullYear()} {APP.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

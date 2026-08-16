import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Body typeface. Exposed to Tailwind as `--font-inter`, consumed by
 * the `--font-sans` token in globals.css.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Display typeface for headings. Exposed as `--font-display-face`,
 * consumed by the `--font-display` token.
 *
 * To swap in a self-hosted face (e.g. Clash Display), replace this
 * export with next/font/local and keep the same `variable` name —
 * no other file needs to change.
 */
export const displayFace = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-face",
});

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "PKR";
const LOCALE = process.env.NEXT_PUBLIC_LOCALE || "en-PK";

/** Formats a number as currency. Returns an em-dash for invalid input. */
export const formatCurrency = (value, options = {}) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
};

/** Formats an ISO date string or Date into a readable date. */
export const formatDate = (value, options = {}) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
};

/** Compact number display, e.g. 12500 -> "12.5K". */
export const formatCompact = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat(LOCALE, { notation: "compact" }).format(amount);
};

/** Truncates a string on a word-safe boundary. */
export const truncate = (str = "", max = 60) =>
  str.length > max ? `${str.slice(0, max).trimEnd()}…` : str;

/** URL-safe slug from arbitrary text. */
export const slugify = (str = "") =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Percentage discount between original and sale price. */
export const discountPercent = (original, sale) => {
  const o = Number(original);
  const s = Number(sale);
  if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0 || s >= o) return 0;
  return Math.round(((o - s) / o) * 100);
};

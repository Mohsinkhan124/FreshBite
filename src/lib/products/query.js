export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const DEFAULT_SORT = "latest";

export const DEFAULT_PRODUCT_FILTERS = {
  page: 1,
  search: "",
  category: "",
  featured: false,
  minPrice: null,
  maxPrice: null,
  sort: DEFAULT_SORT,
};

/**
 * Parses Next.js's `searchParams` (values may be string | string[] |
 * undefined) into a normalized, typed filter object.
 */
export function parseProductFilters(searchParams = {}) {
  const get = (key) => {
    const value = searchParams?.[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Math.max(1, parseInt(get("page"), 10) || 1);
  const search = (get("search") || "").trim();
  const category = get("category") || "";
  const featured = get("featured") === "true";

  const minPriceRaw = get("minPrice");
  const maxPriceRaw = get("maxPrice");
  const minPrice =
    minPriceRaw !== undefined && minPriceRaw !== "" && !Number.isNaN(Number(minPriceRaw))
      ? Number(minPriceRaw)
      : null;
  const maxPrice =
    maxPriceRaw !== undefined && maxPriceRaw !== "" && !Number.isNaN(Number(maxPriceRaw))
      ? Number(maxPriceRaw)
      : null;

  const sortRaw = get("sort");
  const sort = SORT_OPTIONS.some((option) => option.value === sortRaw) ? sortRaw : DEFAULT_SORT;

  return { page, search, category, featured, minPrice, maxPrice, sort };
}

/** Maps normalized filters to the exact backend query param names. */
export function filtersToApiParams(filters) {
  const params = { page: filters.page, sort: filters.sort };
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.featured) params.featured = true;
  if (filters.minPrice !== null) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== null) params.maxPrice = filters.maxPrice;
  return params;
}

/**
 * Builds a `?query=string` from filters merged with `overrides` — used
 * everywhere a link or router.push needs to change one filter while
 * preserving the rest. Returns "" when there's nothing to encode.
 */
export function filtersToQueryString(filters, overrides = {}) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.search) params.set("search", merged.search);
  if (merged.category) params.set("category", merged.category);
  if (merged.featured) params.set("featured", "true");
  if (merged.minPrice !== null && merged.minPrice !== undefined) params.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice !== null && merged.maxPrice !== undefined) params.set("maxPrice", String(merged.maxPrice));
  if (merged.sort && merged.sort !== DEFAULT_SORT) params.set("sort", merged.sort);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Defensive client-side sort applied to whatever page of products the
 * backend returns. Safe to run even if the backend already sorted
 * correctly — it only reorders items, never changes which ones or how
 * many, so pagination counts stay accurate.
 */
export function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case "price_desc":
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case "name_asc":
      return list.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    case "name_desc":
      return list.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    case "latest":
    default:
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

import { getCategories, getProducts } from "@/lib/api/catalog";
import { APP } from "@/constants/config";

/**
 * Static routes always ship. Product/category URLs are fetched from
 * the real backend and gracefully degrade to just the static routes
 * if that fetch fails (e.g. backend unreachable at build time).
 */
export default async function sitemap() {
  const staticRoutes = ["", "/products", "/categories", "/login", "/register"].map((path) => ({
    url: `${APP.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes = [];
  let categoryRoutes = [];

  try {
    const data = await getProducts({ limit: 100 });
    const products = Array.isArray(data?.products) ? data.products : [];
    productRoutes = products.map((product) => ({
      url: `${APP.url}/products/${product._id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Backend unreachable — sitemap still ships with the static routes below.
  }

  try {
    const data = await getCategories();
    const categories = Array.isArray(data?.categories) ? data.categories : [];
    categoryRoutes = categories.map((category) => ({
      url: `${APP.url}/products?category=${category._id}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  } catch {
    // Same as above.
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}

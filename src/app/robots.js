import { APP } from "@/constants/config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/checkout", "/cart", "/wishlist", "/profile", "/orders"],
      },
    ],
    sitemap: `${APP.url}/sitemap.xml`,
  };
}

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

/** Primary navigation — shown in the desktop nav and the mobile drawer. */
export const MAIN_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
];

/** Footer "Quick links" column. */
export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
];

/**
 * Footer "Categories" column. Points at /categories until slug-based
 * category filtering is built (that standalone browsing page is still
 * a placeholder — the Products page's category filter, built in
 * Feature 4, covers this in the meantime).
 */
export const FOOTER_CATEGORIES = [
  { label: "Fruits & Vegetables", href: "/categories" },
  { label: "Dairy & Eggs", href: "/categories" },
  { label: "Bakery", href: "/categories" },
  { label: "Beverages", href: "/categories" },
  { label: "Snacks & Pantry", href: "/categories" },
  { label: "Meat & Seafood", href: "/categories" },
];

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/freshbite", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/freshbite", icon: Instagram },
  { label: "Twitter", href: "https://twitter.com/freshbite", icon: Twitter },
  { label: "YouTube", href: "https://youtube.com/@freshbite", icon: Youtube },
];

export const CONTACT_INFO = {
  address: "12 Clifton Boulevard, Karachi, Pakistan",
  phone: "+92 300 1234567",
  email: "support@freshbite.app",
};

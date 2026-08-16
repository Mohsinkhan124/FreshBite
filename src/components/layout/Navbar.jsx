"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Menu, ShoppingCart } from "lucide-react";
import { APP } from "@/constants/config";
import { cn } from "@/utils/cn";
import dynamic from "next/dynamic";
import { toggleCartDrawer } from "@/redux/slices/cartSlice";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import IconBadgeLink from "./IconBadgeLink";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), { ssr: false });

/**
 * Sticky, glassmorphic site header.
 *
 * Cart/wishlist counts read the real cart/wishlist slices (Feature 6).
 * The cart icon opens the CartDrawer instead of navigating; wishlist
 * still links straight to /wishlist.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);
  const wishlistCount = useSelector((state) => state.wishlist?.items?.length ?? 0);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "glass sticky top-0 z-40 transition-shadow duration-300",
        scrolled ? "shadow-soft" : "shadow-none",
      )}
    >
      <div className="container-fb flex h-16 items-center gap-4 lg:h-20 lg:gap-6">
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-bold tracking-tight text-brand-600 lg:text-2xl"
        >
          {APP.name}
        </Link>

        <DesktopNav />

        <div className="hidden flex-1 md:block lg:max-w-md">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:gap-2">
          <IconBadgeLink
            href="/wishlist"
            icon={Heart}
            label="Wishlist"
            count={wishlistCount}
            className="hidden sm:flex"
          />
          <IconBadgeLink onClick={() => dispatch(toggleCartDrawer())} icon={ShoppingCart} label="Cart" count={cartCount} />

          <div className="hidden lg:block">
            <UserMenu />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-cream-200 lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="border-t border-cream-200/70 px-4 py-2.5 md:hidden">
        <SearchBar />
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer />
    </header>
  );
}

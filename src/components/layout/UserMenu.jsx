"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, Package, User, UserPlus } from "lucide-react";
import { cn } from "@/utils/cn";
import { logout } from "@/redux/slices/authSlice";
import Avatar from "../common/Avatar";


/**
 * Account dropdown. Reads the real `state.auth.user` (Feature 7) —
 * `null` for guests, the logged-in user's { name, email } once signed in.
 */
export default function UserMenu() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth?.user ?? null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const initials = user?.name
    ? user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("")
    : "";

  function handleLogout() {
    setOpen(false);
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
  "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition",
          user
            ? "bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600"
            : "text-ink-700 hover:bg-cream-200 hover:text-brand-600",
        )}
      >
        {user ? (
          <Avatar
            src={user.avatar}
            name={user.name}
            size={40}
          />
        ) : (
          <User className="h-5 w-5" strokeWidth={1.8} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-cream-200 bg-white p-2 shadow-lift"
          >
            {user ? (
              <>
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                  <p className="truncate text-xs text-ink-500">{user.email}</p>
                </div>
                <div className="my-1 h-px bg-cream-200" />
                <MenuLink href="/profile" icon={User} label="Profile" onClick={() => setOpen(false)} />
                <MenuLink href="/orders" icon={Package} label="My orders" onClick={() => setOpen(false)} />
                <div className="my-1 h-px bg-cream-200" />
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-cream-100"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.8} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <MenuLink href="/login" icon={LogIn} label="Log in" onClick={() => setOpen(false)} />
                <MenuLink href="/register" icon={UserPlus} label="Create account" onClick={() => setOpen(false)} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, icon: Icon, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-cream-100 hover:text-brand-600"
    >
      <Icon className="h-4 w-4" strokeWidth={1.8} />
      {label}
    </Link>
  );
}

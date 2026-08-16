"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { KeyRound, Lock, LogOut } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";

export default function SecurityCard() {
  const dispatch = useDispatch();
  const router = useRouter();

  function handleLogout() {
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  }

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">Security</h2>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cream-200 px-4 py-3">
        <Lock className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={1.8} />
        <div className="min-w-0">
          <p className="text-xs text-ink-400">Password</p>
          <p className="text-sm font-medium tracking-widest text-ink-900">••••••••</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/forgot-password"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-cream-300 px-4 text-sm font-semibold text-ink-900 transition hover:bg-cream-100 active:scale-[0.97]"
        >
          <KeyRound className="h-4 w-4" strokeWidth={1.8} />
          Change Password
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white shadow-brand transition hover:bg-danger/90 active:scale-[0.97]"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </div>
  );
}

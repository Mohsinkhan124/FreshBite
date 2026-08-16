"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAuthenticated } from "@/utils/auth";
import { checkAdminAccess } from "@/lib/api/auth";

/**
 * Verifies admin access against the real GET /auth/admin endpoint
 * (gated server-side by isAuthenticated + isAdmin) rather than trusting
 * a client-decoded role, matching what that endpoint is for.
 */
export default function AdminRoute({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | allowed

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!isAuthenticated()) {
        router.replace("/login?redirect=/admin");
        return;
      }
      try {
        await checkAdminAccess();
        if (!cancelled) setStatus("allowed");
      } catch (error) {
        if (!cancelled) {
          toast.error(error?.message || "Admin access only");
          router.replace("/");
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status !== "allowed") {
    return (
      <div className="container-fb flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-400">Verifying admin access...</p>
      </div>
    );
  }

  return children;
}

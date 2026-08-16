"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

/**
 * Client-side route guard. The JWT lives in localStorage rather than a
 * cookie, so there's no middleware/edge-level protection possible with
 * this auth model — the check has to happen in the browser.
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="container-fb flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-400">Checking your session...</p>
      </div>
    );
  }

  return children;
}

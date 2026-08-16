"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAddresses } from "@/lib/api/address";

/**
 * Fetches the real default address via the existing GET /address
 * endpoint (Feature 8) rather than showing a static placeholder — a
 * "delivery address" card that never reflects reality wouldn't be
 * production-ready. "Manage Addresses" links to /checkout, which is
 * where full address CRUD already lives (there's no standalone
 * address-management page).
 */
export default function AddressSummaryCard() {
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  useEffect(() => {
    let cancelled = false;
    getAddresses()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.addresses) ? data.addresses : [];
        setAddress(list.find((item) => item.isDefault) || list[0] || null);
        setStatus("succeeded");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="card-fb p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
        <MapPin className="h-4 w-4 text-brand-600" strokeWidth={1.8} />
        Delivery Address
      </h2>

      <div className="mt-4">
        {status === "loading" ? (
          <div className="space-y-2">
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ) : status === "failed" ? (
          <p className="text-sm text-ink-400">We couldn&apos;t load your address right now.</p>
        ) : address ? (
          <div className="text-sm text-ink-500">
            <p className="font-semibold text-ink-900">{address.fullName}</p>
            <p className="mt-1">
              {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
            </p>
            <p className="mt-1">{address.phone}</p>
          </div>
        ) : (
          <p className="text-sm text-ink-400">No delivery address added.</p>
        )}
      </div>

      <Link
        href="/checkout"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-cream-300 px-4 text-sm font-semibold text-ink-900 transition hover:bg-cream-100 active:scale-[0.97]"
      >
        Manage Addresses
      </Link>
    </div>
  );
}

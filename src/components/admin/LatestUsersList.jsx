"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getLatestUsers } from "@/lib/api/dashboard";
import { formatDate } from "@/utils/format";
import EmptyState from "@/components/home/EmptyState";
import ErrorState from "@/components/home/ErrorState";
import Avatar from "@/components/common/Avatar";

export default function LatestUsersList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed

  async function load() {
    setStatus("loading");
    try {
      const res = await getLatestUsers();
      setUsers(Array.isArray(res?.analytics) ? res.analytics : []);
      setStatus("succeeded");
    } catch {
      setStatus("failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (status === "loading") {
    return (
      <div className="card-fb p-6">
        <div className="skeleton h-5 w-32" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="skeleton h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="card-fb p-6">
        <ErrorState description="We couldn't load the latest users right now." onRetry={load} />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card-fb p-6">
        <EmptyState icon={Users} title="No users yet" description="New sign-ups will show up here." />
      </div>
    );
  }

  return (
    <div className="card-fb p-6">
      <h2 className="text-base font-semibold text-ink-900">Latest users</h2>
      <div className="mt-4 divide-y divide-cream-200">
        {users.map((user) => (
          <div key={user._id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar src={user.avatar} name={user.name} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
              <p className="truncate text-xs text-ink-400">{user.email}</p>
            </div>
            <span className="shrink-0 text-xs text-ink-400">{formatDate(user.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useSelector } from "react-redux";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProfileHeaderCard from "./ProfileHeaderCard";
import ProfileStatsGrid from "./ProfileStatsGrid";
import PersonalInfoCard from "./PersonalInfoCard";
import AddressSummaryCard from "./AddressSummaryCard";
import RecentOrdersCard from "./RecentOrdersCard";
import SecurityCard from "./SecurityCard";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

/**
 * Account dashboard. All user identity data comes from
 * state.auth.user (Redux) as required — Orders/Cart/Wishlist/Address
 * counts and summaries are real, fetched via the same existing API
 * functions already used elsewhere (getMyOrders, getAddresses) or
 * already-live Redux state (cart/wishlist), not invented placeholders.
 */
export default function ProfilePageContent() {
  const user = useSelector((state) => state.auth?.user);

  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <section className="container-fb py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Profile" }]} />
      <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">Your account</h1>

      {!user ? (
        <div className="mt-8 space-y-6">
          <div className="card-fb flex flex-col items-center gap-5 p-8 sm:flex-row">
            <div className="skeleton h-24 w-24 shrink-0 rounded-full" />
            <div className="w-full flex-1 space-y-2">
              <div className="skeleton h-5 w-1/3" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-24 rounded-3xl" />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <ProfileHeaderCard
            user={user}
            onEdit={() => setOpenEditModal(true)}
          />
          <ProfileStatsGrid />

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <PersonalInfoCard user={user} />
              <RecentOrdersCard />
            </div>
            <div className="space-y-6">
              <AddressSummaryCard />
              <SecurityCard />
            </div>
          </div>
        </div>
      )}

      <EditProfileModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
    </section>
  );
}

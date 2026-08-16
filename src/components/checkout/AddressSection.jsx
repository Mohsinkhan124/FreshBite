"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import {
  addAddress as addAddressApi,
  deleteAddress as deleteAddressApi,
  getAddresses,
  updateAddress as updateAddressApi,
} from "@/lib/api/address";
import ErrorState from "@/components/home/ErrorState";
import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";

export default function AddressSection({ selectedAddressId, onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | succeeded | failed
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAddresses(preferredId) {
    setStatus("loading");
    try {
      const data = await getAddresses();
      const list = Array.isArray(data?.addresses) ? data.addresses : [];
      setAddresses(list);
      setStatus("succeeded");

      const fallback = list.find((item) => item._id === preferredId) || list.find((item) => item.isDefault) || list[0];
      if (fallback) onSelectAddress(fallback._id);
    } catch {
      setStatus("failed");
    }
  }

  function openAddModal() {
    setEditingAddress(null);
    setModalOpen(true);
  }

  function openEditModal(address) {
    setEditingAddress(address);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      if (editingAddress) {
        const data = await updateAddressApi(editingAddress._id, values);
        toast.success(data?.message || "Address updated successfully");
      } else {
        const data = await addAddressApi(values);
        toast.success(data?.message || "Address added successfully");
      }
      setModalOpen(false);
      await loadAddresses(editingAddress?._id);
    } catch (error) {
      toast.error(error?.message || "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(address) {
    setDeletingId(address._id);
    try {
      const data = await deleteAddressApi(address._id);
      toast.success(data?.message || "Address deleted successfully");
      await loadAddresses();
    } catch (error) {
      toast.error(error?.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(address) {
    try {
      const data = await updateAddressApi(address._id, { isDefault: true });
      toast.success(data?.message || "Default address updated successfully");
      await loadAddresses(address._id);
    } catch (error) {
      toast.error(error?.message || "Failed to update default address");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-900">Shipping address</h2>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add address
        </button>
      </div>

      <div className="mt-4">
        {status === "loading" ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : status === "failed" ? (
          <ErrorState description="We couldn't load your addresses right now." />
        ) : addresses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-cream-300 bg-cream-50 py-10 text-center">
            <p className="text-sm text-ink-500">You don&apos;t have any saved addresses yet.</p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-600"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                selected={address._id === selectedAddressId}
                onSelect={() => onSelectAddress(address._id)}
                onEdit={() => openEditModal(address)}
                onDelete={() => handleDelete(address)}
                onSetDefault={() => handleSetDefault(address)}
                deleting={deletingId === address._id}
              />
            ))}
          </div>
        )}
      </div>

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        initialValues={editingAddress}
      />
    </div>
  );
}

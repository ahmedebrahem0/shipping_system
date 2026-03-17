// merchants/page.tsx
// Merchants management page - list and delete merchants

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMerchants } from "@/features/merchants/hooks/useMerchants";
import MerchantTable from "@/features/merchants/components/MerchantTable";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";

export default function MerchantsPage() {
  const router = useRouter();
  const {
    merchants,
    totalMerchants,
    isLoading,
    isError,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedMerchant,
    handleDelete,
    openDelete,
    isDeleting,
  } = useMerchants();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Merchants"
        description={` merchants total ${totalMerchants}`}
        actionLabel="Add Merchant"
        actionIcon={Plus}
        onAction={() => router.push(ROUTES.MERCHANT_CREATE)}
      />

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : merchants.length === 0 ? (
          <EmptyState
            title="No merchants found"
            description="Start by adding your first merchant."
          />
        ) : (
          <MerchantTable
            merchants={merchants}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Merchant"
        description={`Are you sure you want to delete "${selectedMerchant?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
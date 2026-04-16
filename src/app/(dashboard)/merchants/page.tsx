// merchants/page.tsx
// Merchants management page - list and delete merchants

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMerchants } from "@/features/merchants/hooks/useMerchants";
import MerchantTable from "@/features/merchants/components/MerchantTable";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
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
    page,
    setPage,
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
      <div className="themed-surface overflow-hidden rounded-xl">
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
          <>
            <MerchantTable
              merchants={merchants}
              onDelete={openDelete}
            />
            <Pagination
              currentPage={page}
              totalCount={totalMerchants}
              pageSize={10}
              onPageChange={setPage}
            />
          </>
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

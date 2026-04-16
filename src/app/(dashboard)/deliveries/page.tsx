// deliveries/page.tsx
// Delivery agents management page - list and delete agents

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeliveries } from "@/features/deliveries/hooks/useDeliveries";
import DeliveryTable from "@/features/deliveries/components/DeliveryTable";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { ROUTES } from "@/constants/routes";

export default function DeliveriesPage() {
  const router = useRouter();
  const {
    deliveries,
    isLoading,
    isError,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedDelivery,
    handleDelete,
    openDelete,
    isDeleting,
  } = useDeliveries();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Delivery Agents"
        description={` agents total ${deliveries.length}`}
        actionLabel="Add Agent"
        actionIcon={Plus}
        onAction={() => router.push(ROUTES.DELIVERY_CREATE)}
      />

      {/* Content */}
      <div className="themed-surface overflow-hidden rounded-xl">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : deliveries.length === 0 ? (
          <EmptyState
            title="No delivery agents found"
            description="Start by adding your first delivery agent."
          />
        ) : (
          <DeliveryTable
            deliveries={deliveries}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Delivery Agent"
        description={`Are you sure you want to delete "${selectedDelivery?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

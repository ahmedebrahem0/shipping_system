// settings/shipping-types/page.tsx
// Redirect to settings/governments

// import { redirect } from "next/navigation";

// export default function ShippingTypesPage() {
//   redirect("/settings/governments");
// }
// shipping-types/page.tsx
// Shipping types management page - list, create, edit and delete shipping types

"use client";

import { Plus } from "lucide-react";
import { useShippingTypes } from "@/features/settings/shipping-types/hooks/useShippingTypes";
import ShippingTypeTable from "@/features/settings/shipping-types/components/ShippingTypeTable";
import ShippingTypeForm from "@/features/settings/shipping-types/components/ShippingTypeForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function ShippingTypesPage() {
  const {
    shippingTypes,
    isLoading,
    isError,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedShippingType,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    openDelete,
    isCreating,
    isUpdating,
    isDeleting,
  } = useShippingTypes();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Shipping Types"
        description={`${shippingTypes.length} shipping types total`}
        actionLabel="Add Shipping Type"
        actionIcon={Plus}
        onAction={openCreate}
      />

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : shippingTypes.length === 0 ? (
          <EmptyState
            title="No shipping types found"
            description="Start by adding your first shipping type."
          />
        ) : (
          <ShippingTypeTable
            shippingTypes={shippingTypes}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {selectedShippingType ? "Edit Shipping Type" : "Add Shipping Type"}
            </h2>
            <ShippingTypeForm
              selectedShippingType={selectedShippingType}
              isLoading={isCreating || isUpdating}
              onSubmit={selectedShippingType ? handleUpdate : handleCreate}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Shipping Type"
        description={`Are you sure you want to delete "${selectedShippingType?.type}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
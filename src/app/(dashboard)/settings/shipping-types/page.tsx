// settings/shipping-types/page.tsx
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

  const safeShippingTypes = shippingTypes || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <PageHeader
          title="Shipping Types"
          description={`shipping types total ${safeShippingTypes.length}`}
          actionLabel="Add Shipping Type"
          actionIcon={Plus}
          onAction={openCreate}
        />
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Shipping Types Directory
              </h2>
              <p className="text-sm text-slate-500">
                View, create, update, and manage shipping types.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              Total: {safeShippingTypes.length}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorMessage />
          </div>
        ) : safeShippingTypes.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No shipping types found"
              description="Start by adding your first shipping type."
            />
          </div>
        ) : (
          <div className="px-2 py-2">
            <ShippingTypeTable
              shippingTypes={safeShippingTypes}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedShippingType ? "Edit Shipping Type" : "Add Shipping Type"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the required information and save your changes.
              </p>
            </div>

            <div className="p-6">
              <ShippingTypeForm
                selectedShippingType={selectedShippingType}
                isLoading={isCreating || isUpdating}
                onSubmit={
                  selectedShippingType ? handleUpdate : handleCreate
                }
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
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
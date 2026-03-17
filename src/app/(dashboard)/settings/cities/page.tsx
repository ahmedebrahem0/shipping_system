// cities/page.tsx
// Cities management page - list, create, edit and delete cities

"use client";

import { Plus } from "lucide-react";
import { useCities } from "@/features/settings/cities/hooks/useCities";
import CityTable from "@/features/settings/cities/components/CityTable";
import CityForm from "@/features/settings/cities/components/CityForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function CitiesPage() {
  const {
    cities,
    totalCities,
    isLoading,
    isError,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedCity,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    openDelete,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCities();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Cities"
        description={`cities total ${totalCities} `}
        actionLabel="Add City"
        actionIcon={Plus}
        onAction={openCreate}
      />

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : cities.length === 0 ? (
          <EmptyState
            title="No cities found"
            description="Start by adding your first city."
          />
        ) : (
          <CityTable
            cities={cities}
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
              {selectedCity ? "Edit City" : "Add City"}
            </h2>
            <CityForm
              selectedCity={selectedCity}
              isLoading={isCreating || isUpdating}
              onSubmit={selectedCity ? handleUpdate : handleCreate}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete City"
        description={`Are you sure you want to delete "${selectedCity?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
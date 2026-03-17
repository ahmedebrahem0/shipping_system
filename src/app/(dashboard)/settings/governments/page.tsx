// governments/page.tsx
// Governments & Cities management page with tabs

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useGovernments } from "@/features/settings/governments/hooks/useGovernments";
import { useCities } from "@/features/settings/cities/hooks/useCities";
import GovernmentTable from "@/features/settings/governments/components/GovernmentTable";
import GovernmentForm from "@/features/settings/governments/components/GovernmentForm";
import CityTable from "@/features/settings/cities/components/CityTable";
import CityForm from "@/features/settings/cities/components/CityForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";

type Tab = "governments" | "cities";

export default function GovernmentsAndCitiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("governments");

  const governments = useGovernments();
  const cities = useCities();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Governments & Cities"
        description="Manage governments and cities"
        actionLabel={activeTab === "governments" ? "Add Government" : "Add City"}
        actionIcon={Plus}
        onAction={
          activeTab === "governments"
            ? governments.openCreate
            : cities.openCreate
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("governments")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "governments"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Governments
        </button>
        <button
          onClick={() => setActiveTab("cities")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "cities"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cities
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* Governments Tab */}
        {activeTab === "governments" && (
          <>
            {governments.isLoading ? (
              <Loader />
            ) : governments.isError ? (
              <ErrorMessage />
            ) : governments.governments.length === 0 ? (
              <EmptyState
                title="No governments found"
                description="Start by adding your first government."
              />
            ) : (
              <GovernmentTable
                governments={governments.governments}
                onEdit={governments.openEdit}
                onDelete={governments.openDelete}
              />
            )}
          </>
        )}

        {/* Cities Tab */}
        {activeTab === "cities" && (
          <>
            {cities.isLoading ? (
              <Loader />
            ) : cities.isError ? (
              <ErrorMessage />
            ) : cities.cities.length === 0 ? (
              <EmptyState
                title="No cities found"
                description="Start by adding your first city."
              />
            ) : (
              <CityTable
                cities={cities.cities}
                onEdit={cities.openEdit}
                onDelete={cities.openDelete}
              />
            )}
          </>
        )}

      </div>

      {/* Government Form Modal */}
      {governments.isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => governments.setIsFormOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {governments.selectedGovernment ? "Edit Government" : "Add Government"}
            </h2>
            <GovernmentForm
              selectedGovernment={governments.selectedGovernment}
              isLoading={governments.isCreating || governments.isUpdating}
              onSubmit={governments.selectedGovernment ? governments.handleUpdate : governments.handleCreate}
              onCancel={() => governments.setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* City Form Modal */}
      {cities.isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => cities.setIsFormOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {cities.selectedCity ? "Edit City" : "Add City"}
            </h2>
            <CityForm
              selectedCity={cities.selectedCity}
              isLoading={cities.isCreating || cities.isUpdating}
              onSubmit={cities.selectedCity ? cities.handleUpdate : cities.handleCreate}
              onCancel={() => cities.setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Government Confirm Delete */}
      <ConfirmDialog
        isOpen={governments.isDeleteOpen}
        title="Delete Government"
        description={`Are you sure you want to delete "${governments.selectedGovernment?.name}"?`}
        isLoading={governments.isDeleting}
        onConfirm={governments.handleDelete}
        onCancel={() => governments.setIsDeleteOpen(false)}
      />

      {/* City Confirm Delete */}
      <ConfirmDialog
        isOpen={cities.isDeleteOpen}
        title="Delete City"
        description={`Are you sure you want to delete "${cities.selectedCity?.name}"?`}
        isLoading={cities.isDeleting}
        onConfirm={cities.handleDelete}
        onCancel={() => cities.setIsDeleteOpen(false)}
      />

    </div>
  );
}
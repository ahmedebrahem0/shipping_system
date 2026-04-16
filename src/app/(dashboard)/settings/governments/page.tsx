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
import Pagination from "@/components/common/Pagination";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
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
      </div>

      {/* Tabs Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-2 w-fit">
          <button
            onClick={() => setActiveTab("governments")}
            className={`relative inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "governments"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
            }`}
          >
            Governments
          </button>

          <button
            onClick={() => setActiveTab("cities")}
            className={`relative inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "cities"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
            }`}
          >
            Cities
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Governments Tab */}
        {activeTab === "governments" && (
          <div className="min-h-[420px]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Governments Directory
                  </h2>
                  <p className="text-sm text-slate-500">
                    View, create, update, and manage governments records.
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  Total: {governments.totalGovernments}
                </div>
              </div>
            </div>

            {governments.isLoading ? (
              <div className="p-8">
                <Loader />
              </div>
            ) : governments.isError ? (
              <div className="p-8">
                <ErrorMessage />
              </div>
            ) : governments.governments.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No governments found"
                  description="Start by adding your first government."
                />
              </div>
            ) : (
              <>
                <div className="px-2 pb-2 pt-2">
                  <GovernmentTable
                    governments={governments.governments}
                    onEdit={governments.openEdit}
                    onDelete={governments.openDelete}
                  />
                </div>

                <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                  <Pagination
                    currentPage={governments.page}
                    totalCount={governments.totalGovernments}
                    pageSize={10}
                    onPageChange={governments.setPage}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === "cities" && (
          <div className="min-h-[420px]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Cities Directory
                  </h2>
                  <p className="text-sm text-slate-500">
                    View, create, update, and manage cities records.
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  Total: {cities.totalCities}
                </div>
              </div>
            </div>

            {cities.isLoading ? (
              <div className="p-8">
                <Loader />
              </div>
            ) : cities.isError ? (
              <div className="p-8">
                <ErrorMessage />
              </div>
            ) : cities.cities.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No cities found"
                  description="Start by adding your first city."
                />
              </div>
            ) : (
              <>
                <div className="px-2 pb-2 pt-2">
                  <CityTable
                    cities={cities.cities}
                    onEdit={cities.openEdit}
                    onDelete={cities.openDelete}
                  />
                </div>

                <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4">
                  <Pagination
                    currentPage={cities.page}
                    totalCount={cities.totalCities}
                    pageSize={10}
                    onPageChange={cities.setPage}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Government Form Modal */}
      {governments.isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => governments.setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {governments.selectedGovernment ? "Edit Government" : "Add Government"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the required information and save your changes.
              </p>
            </div>

            <div className="p-6">
              <GovernmentForm
                selectedGovernment={governments.selectedGovernment}
                isLoading={governments.isCreating || governments.isUpdating}
                onSubmit={
                  governments.selectedGovernment
                    ? governments.handleUpdate
                    : governments.handleCreate
                }
                onCancel={() => governments.setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* City Form Modal */}
      {cities.isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => cities.setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {cities.selectedCity ? "Edit City" : "Add City"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the required information and save your changes.
              </p>
            </div>

            <div className="p-6">
              <CityForm
                selectedCity={cities.selectedCity}
                isLoading={cities.isCreating || cities.isUpdating}
                onSubmit={cities.selectedCity ? cities.handleUpdate : cities.handleCreate}
                onCancel={() => cities.setIsFormOpen(false)}
              />
            </div>
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
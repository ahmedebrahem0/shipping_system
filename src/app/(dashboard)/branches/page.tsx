// branches/page.tsx
// Branches management page - list, create, edit and delete branches

"use client";

import { Plus } from "lucide-react";
import { useBranches } from "@/features/branches/hooks/useBranches";
import BranchTable from "@/features/branches/components/BranchTable";
import BranchForm from "@/features/branches/components/BranchForm";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function BranchesPage() {
  const {
    branches,
    totalBranches,
    page,
    setPage,
    isLoading,
    isError,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedBranch,
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    openDelete,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBranches();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="themed-surface rounded-3xl p-6">
        <PageHeader
          className="text-white"
          title="Branches"
          description={`branches total ${totalBranches}`}
          actionLabel="Add Branch"
          actionIcon={Plus}
          onAction={openCreate}
        />
      </div>

      {/* Content */}
      <div className="themed-surface overflow-hidden rounded-3xl">
        <div className="themed-surface-header px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Branches Directory
              </h2>
              <p className="text-sm text-slate-500">
                View, create, update, and manage branch records.
              </p>
            </div>
            <div className="themed-surface rounded-full px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              Total: {totalBranches}
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
        ) : branches.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No branches found"
              description="Start by adding your first branch."
            />
          </div>
        ) : (
          <>
            <div className="px-2 pb-2 pt-2">
              <BranchTable
                branches={branches}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            </div>

            <div className="themed-surface-header px-4 py-4">
              <Pagination
                currentPage={page}
                totalCount={totalBranches}
                pageSize={10}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="themed-surface relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
            <div className="themed-surface-header px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                {selectedBranch ? "Edit Branch" : "Add Branch"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the required information and save your changes.
              </p>
            </div>

            <div className="p-6">
              <BranchForm
                selectedBranch={selectedBranch}
                isLoading={isCreating || isUpdating}
                onSubmit={selectedBranch ? handleUpdate : handleCreate}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Branch"
        description={`Are you sure you want to delete "${selectedBranch?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

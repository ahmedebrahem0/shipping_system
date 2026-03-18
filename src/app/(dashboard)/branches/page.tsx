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
    <div>
      {/* Header */}
      <PageHeader
      className="bg-orange-500 text-white"
        title="Branches"
        description={`branches total ${totalBranches}`}
        actionLabel="Add Branch"
        actionIcon={Plus}
        onAction={openCreate}
      />

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : branches.length === 0 ? (
          <EmptyState
            title="No branches found"
            description="Start by adding your first branch."
          />
        ) : (
          <>
            <BranchTable
              branches={branches}
              onEdit={openEdit}
              onDelete={openDelete}
            />
            <Pagination
              currentPage={page}
              totalCount={totalBranches}
              pageSize={10}
              onPageChange={setPage}
            />
          </>
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
              {selectedBranch ? "Edit Branch" : "Add Branch"}
            </h2>
            <BranchForm
              selectedBranch={selectedBranch}
              isLoading={isCreating || isUpdating}
              onSubmit={selectedBranch ? handleUpdate : handleCreate}
              onCancel={() => setIsFormOpen(false)}
            />
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
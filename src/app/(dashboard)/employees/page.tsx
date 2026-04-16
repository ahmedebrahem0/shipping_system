// employees/page.tsx
// Employees management page - list and delete employees

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Pagination from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";

export default function EmployeesPage() {
  const router = useRouter();
  const {
    employees,
    totalCount,
    pageIndex,
    isLoading,
    isError,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedEmployee,
    handleDelete,
    openDelete,
    isDeleting,
    setPageIndex,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
  } = useEmployees();

  const displayEmployees = searchTerm.length >= 2 ? searchResults : employees;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Employees"
        description={`employees total ${totalCount}`}
        actionLabel="Add Employee"
        actionIcon={Plus}
        onAction={() => router.push(ROUTES.EMPLOYEE_CREATE)}
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 rounded-md"
        />
      </div>

      {/* Content */}
      <div className="themed-surface overflow-hidden rounded-xl">
        {isLoading || isSearching ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : displayEmployees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description={searchTerm ? "No employees match your search." : "Start by adding your first employee."}
          />
        ) : (
          <>
            <EmployeeTable
              employees={displayEmployees}
              onDelete={openDelete}
            />
            {searchTerm.length < 2 && (
              <Pagination
                currentPage={pageIndex}
                totalCount={totalCount}
                pageSize={10}
                onPageChange={setPageIndex}
              />
            )}
          </>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Employee"
        description={`Are you sure you want to delete "${selectedEmployee?.name}"?`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

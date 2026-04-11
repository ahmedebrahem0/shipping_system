// app/(dashboard)/settings/roles/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRoles } from "@/features/settings/roles/hooks/useRoles";
import RoleTable from "@/features/settings/roles/components/RoleTable";
import RolePermissionsTable from "@/features/settings/roles/components/RolePermissionsTable";
import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function RolesPage() {
  const {
    roles,
    selectedRole,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    openCreate,
    openEdit,
    openDelete,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRoles();

  const [inputValue, setInputValue] = useState("");

  const handleOpenCreate = () => {
    setInputValue("");
    openCreate();
  };

  const handleOpenEdit = (role: NonNullable<typeof selectedRole>) => {
    setInputValue(role.name);
    openEdit(role);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setInputValue("");
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    if (selectedRole) {
      handleUpdateRole(inputValue.trim());
    } else {
      handleCreateRole(inputValue.trim());
    }
    handleClose();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Roles"
        description="Manage system roles and their permissions"
        actionLabel="New Role"
        actionIcon={Plus}
        onAction={handleOpenCreate}
      />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roles Table - Left Side */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <RoleTable
              roles={roles}
              onEdit={handleOpenEdit}
              onDelete={openDelete}
            />
          </div>
        </div>

        {/* Permissions Table - Right Side */}
        <div className="lg:col-span-7">
          <RolePermissionsTable />
        </div>
      </div>

      {/* Role Create/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {selectedRole ? "Edit Role" : "Create New Role"}
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. Supervisor, Accountant, Viewer..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[primary] text-sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isCreating || isUpdating}
                className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {selectedRole ? "Update Role" : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Role"
        description={`Are you sure you want to delete "${selectedRole?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDeleteRole}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}

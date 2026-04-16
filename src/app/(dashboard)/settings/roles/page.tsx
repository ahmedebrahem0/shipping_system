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
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <PageHeader
          title="Roles"
          description="Manage system roles and their permissions"
          actionLabel="New Role"
          actionIcon={Plus}
          onAction={handleOpenCreate}
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Roles Table */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Roles List
              </h2>
            </div>

            <div className="px-2 py-2">
              <RoleTable
                roles={roles}
                onEdit={handleOpenEdit}
                onDelete={openDelete}
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Role Permissions
              </h2>
            </div>

            <div className="p-4">
              <RolePermissionsTable />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">
                {selectedRole ? "Edit Role" : "Create New Role"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="e.g. Supervisor, Accountant, Viewer..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="rounded-xl px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isCreating || isUpdating}
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {selectedRole ? "Update Role" : "Create Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
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
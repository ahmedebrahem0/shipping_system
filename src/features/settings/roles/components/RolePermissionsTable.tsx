// features/settings/roles/components/RolePermissionsTable.tsx
"use client";

import { useRoles } from "../hooks/useRoles";
import type { Permission, UpdateRolePermissionRequest } from "@/types/role.types";

export default function RolePermissionsTable() {
  const {
    selectedRole,
    permissions,
    handleUpdatePermission,
  } = useRoles();

  if (!selectedRole) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Select a role from the left table to manage its permissions</p>
      </div>
    );
  }

  const handleCheckboxChange = (
    permissionId: number,
    field: "canView" | "canAdd" | "canEdit" | "canDelete",
    checked: boolean
  ) => {
    const currentPerm = selectedRole.rolePermissions.find(
      (p) => p.permission_Id === permissionId && !p.isDeleted
    );

    const isExisting = !!currentPerm;

    const baseData: UpdateRolePermissionRequest = {
      role_Id: selectedRole.id,
      canView: currentPerm?.canView ?? false,
      canAdd: currentPerm?.canAdd ?? false,
      canEdit: currentPerm?.canEdit ?? false,
      canDelete: currentPerm?.canDelete ?? false,
    };

    const updatedData: UpdateRolePermissionRequest = {
      ...baseData,
      [field]: checked,
    };

    handleUpdatePermission(permissionId, updatedData, isExisting);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Permissions for <span className="text-[primary]">{selectedRole.name}</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4 w-80">Permission Module</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 w-20">View</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 w-20">Add</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 w-20">Edit</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 w-20">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {permissions.map((permission: Permission) => {
              const currentPerm = selectedRole.rolePermissions.find(
                (p) => p.permission_Id === permission.id && !p.isDeleted
              );

              return (
                <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {permission.name}
                  </td>

                  {/* View */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={currentPerm?.canView ?? false}
                      onChange={(e) => handleCheckboxChange(permission.id, "canView", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[primary] focus:ring-[primary]"
                    />
                  </td>

                  {/* Add */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={currentPerm?.canAdd ?? false}
                      onChange={(e) => handleCheckboxChange(permission.id, "canAdd", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[primary] focus:ring-[primary]"
                    />
                  </td>

                  {/* Edit */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={currentPerm?.canEdit ?? false}
                      onChange={(e) => handleCheckboxChange(permission.id, "canEdit", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[primary] focus:ring-[primary]"
                    />
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={currentPerm?.canDelete ?? false}
                      onChange={(e) => handleCheckboxChange(permission.id, "canDelete", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[primary] focus:ring-[primary]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// RoleTable.tsx
// Displays roles in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import type { Role } from "@/types/role.types";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">#</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Permissions</th>
            <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.map((role, index) => {
            const activePermissionsCount = role.rolePermissions.filter(
              (p) => !p.isDeleted
            ).length;

            return (
              <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.name}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {activePermissionsCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(role)}
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(role)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

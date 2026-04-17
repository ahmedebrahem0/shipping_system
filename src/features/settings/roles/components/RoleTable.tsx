// RoleTable.tsx

import { Pencil, Trash2 } from "lucide-react";
import type { Role } from "@/types/role.types";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                #
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Name
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Permissions
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {roles.map((role, index) => {
              const activePermissionsCount = role.rolePermissions.filter(
                (p) => !p.isDeleted
              ).length;

              return (
                <tr
                  key={role.id}
                  className="transition-all duration-200 hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                      {index + 1}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {role.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {activePermissionsCount}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(role)}
                        aria-label={`Edit role ${role.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDelete(role)}
                        aria-label={`Delete role ${role.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
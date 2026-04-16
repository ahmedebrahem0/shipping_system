// PermissionTable.tsx
// Displays permissions in a table

import type { Permission } from "@/types/role.types";

interface PermissionTableProps {
  permissions: Permission[];
}

export default function PermissionTable({ permissions }: PermissionTableProps) {
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
                Permission Name
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {permissions.map((permission, index) => (
              <tr
                key={permission.id}
                className="transition-all duration-200 hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                    {index + 1}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {permission.name}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {permission.isDeleted ? (
                    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      Inactive
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
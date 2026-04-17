// BranchTable.tsx
// Displays branches in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import type { Branch } from "@/types/branch.types";
import { formatDate } from "@/lib/utils/formatters";

interface BranchTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

export default function BranchTable({
  branches,
  onEdit,
  onDelete,
}: BranchTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Name
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mobile
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Location
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {branches.map((branch) => (
              <tr
                key={branch.id}
                className="transition-all duration-200 hover:bg-slate-50/80"
              >
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-slate-900">
                    {branch.name}
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                    {branch.mobile}
                  </span>
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="max-w-[260px] truncate text-sm text-slate-600">
                    {branch.location}
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                    {formatDate(branch.createdDate)}
                  </span>
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(branch)}
                      aria-label={`Edit branch ${branch.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDelete(branch)}
                      aria-label={`Delete branch ${branch.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
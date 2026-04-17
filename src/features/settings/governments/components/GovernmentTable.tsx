// GovernmentTable.tsx
// Displays governments in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import type { Government } from "@/types/government.types";

interface GovernmentTableProps {
  governments: Government[];
  onEdit: (government: Government) => void;
  onDelete: (government: Government) => void;
}

export default function GovernmentTable({
  governments,
  onEdit,
  onDelete,
}: GovernmentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                #
              </th>
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Name
              </th>
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Branch ID
              </th>
              <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {governments.map((government) => (
              <tr
                key={government.id}
                className="group transition-colors duration-200 hover:bg-slate-50/80"
              >
                <td className="px-5 py-4 text-sm font-medium text-slate-500">
                  <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {government.id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {government.name}
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700">
                    {government.branch_Id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(government)}
                      aria-label={`Edit government ${government.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDelete(government)}
                      aria-label={`Delete government ${government.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
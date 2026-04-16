// ShippingTypeTable.tsx
// Displays shipping types in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import type { ShippingType } from "@/types/shippingType.types";

interface ShippingTypeTableProps {
  shippingTypes: ShippingType[];
  onEdit: (shippingType: ShippingType) => void;
  onDelete: (shippingType: ShippingType) => void;
}

export default function ShippingTypeTable({
  shippingTypes,
  onEdit,
  onDelete,
}: ShippingTypeTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                #
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Type
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Description
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Cost
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {shippingTypes.map((shippingType) => (
              <tr
                key={shippingType.id}
                className="transition-all duration-200 hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {shippingType.id}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {shippingType.type}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="max-w-[320px] truncate text-sm text-slate-600">
                    {shippingType.description || "—"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {shippingType.cost} EGP
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(shippingType)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDelete(shippingType)}
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
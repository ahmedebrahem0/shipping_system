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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">#</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Description</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Cost</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {shippingTypes.map((shippingType) => (
            <tr key={shippingType.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-500">{shippingType.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{shippingType.type}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{shippingType.description || "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{shippingType.cost} EGP</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(shippingType)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shippingType)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
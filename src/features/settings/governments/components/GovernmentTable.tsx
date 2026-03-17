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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">#</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Branch ID</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {governments.map((government) => (
            <tr key={government.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-500">{government.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{government.name}</td>
              <td className="px-4 py-3 px-10 text-sm text-gray-600">{government.branch_Id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(government)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(government)}
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
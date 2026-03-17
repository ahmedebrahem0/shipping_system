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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Mobile</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Location</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Created At</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {branches.map((branch) => (
            <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{branch.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{branch.mobile}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{branch.location}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(branch.createdDate)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(branch)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(branch)}
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
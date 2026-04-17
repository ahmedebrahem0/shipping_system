// EmployeeTable.tsx
// Displays employees in a table with edit and delete actions

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Employee } from "@/types/employee.types";
import { ROUTES } from "@/constants/routes";

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Employee</th>
            {/* <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th> */}
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Address</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Branch</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                {/* <p className="text-xs text-gray-500">{employee.email ?? "—"}</p> */}
              </td>
              {/* <td className="px-4 py-3 text-sm text-gray-600">
                {employee.phone ?? "—"}
              </td> */}
              <td className="px-4 py-3 text-sm text-gray-600">{employee.address}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{employee.branchId}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  employee.isDeleted
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {employee.isDeleted ? "Inactive" : "Active"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`${ROUTES.EMPLOYEES}/${employee.id}?edit=true`}
                    aria-label={`Edit employee ${employee.name}`}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(employee)}
                    aria-label={`Delete employee ${employee.name}`}
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
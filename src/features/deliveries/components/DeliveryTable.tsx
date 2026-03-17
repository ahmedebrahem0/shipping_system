// DeliveryTable.tsx
// Displays delivery agents in a table with view, edit and delete actions

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Delivery } from "@/types/delivery.types";
import { ROUTES } from "@/constants/routes";

interface DeliveryTableProps {
  deliveries: Delivery[];
  onDelete: (delivery: Delivery) => void;
}

export default function DeliveryTable({
  deliveries,
  onDelete,
}: DeliveryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Agent</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Branch</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Governments</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Discount Type</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Company %</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{delivery.name}</p>
                <p className="text-xs text-gray-500">{delivery.email}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{delivery.phone}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{delivery.branchName}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {delivery.governmentName.join(", ")}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{delivery.discountType}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{delivery.companyPercentage}%</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={ROUTES.DELIVERY_DETAILS(delivery.id)}
                    className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`${ROUTES.DELIVERY_DETAILS(delivery.id)}?edit=true`}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(delivery)}
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
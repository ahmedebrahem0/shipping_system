// MerchantTable.tsx
// Displays merchants in a table with view, edit and delete actions

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Merchant } from "@/types/merchant.types";
import { ROUTES } from "@/constants/routes";

interface MerchantTableProps {
  merchants: Merchant[];
  onDelete: (merchant: Merchant) => void;
}

export default function MerchantTable({
  merchants,
  onDelete,
}: MerchantTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Merchant</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Store</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Location</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Branch</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Pickup Cost</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Created At</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {merchants.map((merchant) => (
            <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
                <p className="text-xs text-gray-500">{merchant.email}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {merchant.storeName || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{merchant.phone}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {merchant.government} - {merchant.city}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{merchant.branchsNames}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{merchant.pickupCost} EGP</td>
              <td className="px-4 py-3 text-sm text-gray-600">{merchant.createdDate}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={ROUTES.MERCHANT_DETAILS(merchant.id)}
                    aria-label={`View details for ${merchant.name}`}
                    className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`${ROUTES.MERCHANT_DETAILS(merchant.id)}?edit=true`}
                    aria-label={`Edit ${merchant.name}`}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(merchant)}
                    aria-label={`Delete ${merchant.name}`}
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
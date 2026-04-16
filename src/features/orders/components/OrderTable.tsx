// OrderTable.tsx
// Displays orders in a table with actions based on user role

import { Eye, Trash2, RefreshCw, Truck } from "lucide-react";
import type { OrderListItem } from "@/types/order.types";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderTableProps {
  orders: OrderListItem[];
  isAdmin: boolean;
  isEmployee: boolean;
  isMerchant: boolean;
  isDelivery: boolean;
  selectedStatus: string;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number) => void;
  onAssignDelivery: (id: number) => void;
}

export default function OrderTable({
  orders,
  isAdmin,
  isEmployee,
  isMerchant,
  isDelivery,
  selectedStatus,
  onView,
  onDelete,
  onChangeStatus,
  onAssignDelivery,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Serial #</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Client</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Location</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Cost</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Status</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Date</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => {
            const [clientName, clientPhone1, clientPhone2] = order.clientData.split("\n");

            return (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">

                {/* Serial Number */}
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-800">#{order.serialNumber}</p>
                </td>

                {/* Client */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{clientName}</p>
                  <p className="text-xs text-slate-600">{clientPhone1}</p>
                  {clientPhone2 && (
                    <p className="text-xs text-slate-600">{clientPhone2}</p>
                  )}
                </td>

                {/* Location */}
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-700">{order.governrate}</p>
                  <p className="text-xs text-slate-600">{order.city}</p>
                </td>

                {/* Cost */}
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{order.orderCost} EGP</p>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <OrderStatusBadge status={selectedStatus} />
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <p className="text-xs text-slate-600">{order.createdDate}</p>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* View - all roles */}
                    <button
                      type="button"
                      onClick={() => onView(order.id)}
                      className="p-1.5 rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Change Status - Admin, Employee, Delivery */}
                    {(isAdmin || isEmployee || isDelivery) && (
                      <button
                        type="button"
                        onClick={() => onChangeStatus(order.id)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                        title="Change Status"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}

                    {/* Assign Delivery - Admin, Employee */}
                    {(isAdmin || isEmployee) && (
                      <button
                        type="button"
                        onClick={() => onAssignDelivery(order.id)}
                        className="p-1.5 rounded-lg bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                        title="Assign Delivery"
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete - Admin, Employee, Merchant */}
                    {(isAdmin || isEmployee || isMerchant) && (
                      <button
                        type="button"
                        onClick={() => onDelete(order.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

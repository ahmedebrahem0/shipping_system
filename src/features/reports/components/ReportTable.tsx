// ReportTable.tsx
// Displays order reports in a table

import type { OrderReport } from "@/types/report.types";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/constants/orderStatuses";
import { formatCurrency } from "@/lib/utils/formatters";

interface ReportTableProps {
  orders: OrderReport[];
}

export default function ReportTable({ orders }: ReportTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Serial #</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Merchant</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Client</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Location</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Order Cost</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Shipping Cost</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Company Rights</th>
            <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.serialNumber} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                #{order.serialNumber}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  ORDER_STATUS_COLORS[order.orderStatus as keyof typeof ORDER_STATUS_COLORS] ?? "bg-gray-100 text-gray-700"
                }`}>
                  {ORDER_STATUS_LABELS[order.orderStatus as keyof typeof ORDER_STATUS_LABELS] ?? order.orderStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{order.merchantName}</td>
              <td className="px-4 py-3">
                <p className="text-sm text-gray-900">{order.clientName}</p>
                <p className="text-xs text-gray-500">{order.clientPhone}</p>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {order.governrate} - {order.city}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatCurrency(order.orderCost)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {formatCurrency(order.shippingCost)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {order.companyRights ? formatCurrency(order.companyRights) : "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{order.createdDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
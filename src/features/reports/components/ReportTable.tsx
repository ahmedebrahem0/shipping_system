import type { OrderReport } from "@/types/report.types";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/constants/orderStatuses";
import { formatCurrency } from "@/lib/utils/formatters";

interface ReportTableProps {
  orders: OrderReport[];
}

export default function ReportTable({ orders }: ReportTableProps) {
  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-500 border border-dashed rounded-xl">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        
        {/* Header */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Serial #
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Merchant
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Order Cost
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Shipping Cost
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {orders.map((order, index) => (
            <tr
              key={`${order.orderNumber}-${index}`}
              className="hover:bg-gray-50/80 transition-colors even:bg-gray-50/40"
            >
                {/* Serial */}
              <td className="px-4 py-3 font-semibold text-gray-900">
                #{order.serialNumber}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    ORDER_STATUS_COLORS[
                      order.orderStatus as keyof typeof ORDER_STATUS_COLORS
                    ] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {
                    ORDER_STATUS_LABELS[
                      order.orderStatus as keyof typeof ORDER_STATUS_LABELS
                    ] ?? order.orderStatus
                  }
                </span>
              </td>

              {/* Merchant */}
              <td className="px-4 py-3 text-gray-700 font-medium">
                {order.merchantName}
              </td>

              {/* Client */}
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">
                    {order.clientName}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-pre-line">
                    {order.clientPhone}
                  </span>
                </div>
              </td>

              {/* Location */}
              <td className="px-4 py-3 text-gray-600">
                {order.address}
              </td>

              {/* Order Cost */}
              <td className="px-4 py-3 font-medium text-gray-800">
                {formatCurrency(order.totalCost)}
              </td>

              {/* Shipping Cost */}
              <td className="px-4 py-3 text-gray-600">
                {formatCurrency(order.shippingCost)}
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-gray-500 text-xs">
                {order.createdDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
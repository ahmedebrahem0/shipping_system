// orders/[id]/page.tsx
// Order details page - shows order info, products and allows editing

"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetProductsQuery, useUpdateOrderMutation } from "@/store/slices/api/apiSlice";
import { useOrders } from "@/features/orders/hooks/useOrders";
import OrderProductsList from "@/features/orders/components/OrderProductsList";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants/orderStatuses";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const orderId = Number(id);

  // ==================== Get Products ====================
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const orderProducts = products?.filter((p) => p.orderId === orderId) ?? [];

  // ==================== Get Order from list ====================
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  // ==================== Update Order ====================
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  if (isLoading) return <Loader fullPage />;
  if (isError) return <ErrorMessage />;

  const [clientName, clientPhone1, clientPhone2] = order?.clientData?.split("\n") ?? [];

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={`Order #${order?.serialNumber ?? orderId}`}
        description={`Created at ${order?.createdDate ?? ""}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Order Info ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Serial Number</p>
                <p className="text-sm font-bold text-gray-900">#{order?.serialNumber}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Status</p>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  ORDER_STATUS_COLORS[order?.orderStatus as keyof typeof ORDER_STATUS_COLORS] ?? "bg-gray-100 text-gray-700"
                )}>
                  {ORDER_STATUS_LABELS[order?.orderStatus as keyof typeof ORDER_STATUS_LABELS] ?? "—"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Location</p>
                <p className="text-sm text-gray-900">{order?.governrate} - {order?.city}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Order Cost</p>
                <p className="text-sm font-bold text-gray-900">{order?.orderCost} EGP</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Created At</p>
                <p className="text-sm text-gray-900">{order?.createdDate}</p>
              </div>

            </div>
          </div>

          {/* Client Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Name</p>
                <p className="text-sm font-medium text-gray-900">{clientName ?? "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase">Phone 1</p>
                <p className="text-sm text-gray-900">{clientPhone1 ?? "—"}</p>
              </div>

              {clientPhone2 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-400 uppercase">Phone 2</p>
                  <p className="text-sm text-gray-900">{clientPhone2}</p>
                </div>
              )}

            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <OrderProductsList
              products={orderProducts}
              orderId={orderId}
              isEditing={true}
            />
          </div>

        </div>

        {/* ── Actions ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Actions</h3>

            <button
              onClick={() => router.push(ROUTES.ORDERS)}
              className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back to Orders
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
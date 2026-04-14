"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrdersQuery } from "@/store/slices/api/apiSlice";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/constants/orderStatuses";
import OrderProductsList from "@/features/orders/components/OrderProductsList";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/order.types";
import {
  Hash,
  MapPin,
  Calendar,
  User,
  Phone,
  Banknote,
  ArrowLeft,
  PackageCheck,
} from "lucide-react";

type OrderWithDetails = {
  id: number;
  serialNumber: string;
  createdDate: string;
  clientData?: string;
  governrate: string;
  city: string;
  orderCost: number;
  products?: Product[];
  clientName?: string;
  clientPhone1?: string;
  clientPhone2?: string;
  orderStatus?: string;
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const routeOrderId = Array.isArray(id) ? id[0] : id;
  const orderId = Number(routeOrderId);
  const isValidOrderId = Number.isFinite(orderId) && orderId > 0;

  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersErrorData,
  } = useGetOrdersQuery(
    { status: ORDER_STATUSES.NEW },
    { skip: !isValidOrderId }
  );

  const orders = useMemo(
    () => (ordersResponse?.data?.orders ?? []) as OrderWithDetails[],
    [ordersResponse]
  );

  const order = useMemo(
    () => orders.find((item) => item.id === orderId),
    [orders, orderId]
  );

  const orderProducts = useMemo(
    () => ((order?.products ?? []) as Product[]).filter((product) => !product?.isDeleted),
    [order]
  );

  const clientInfo = useMemo(() => {
    const clientDataParts = order?.clientData?.split("\n") ?? [];
    return {
      clientName: order?.clientName ?? clientDataParts[0] ?? "",
      clientPhone1: order?.clientPhone1 ?? clientDataParts[1] ?? "",
      clientPhone2: order?.clientPhone2 ?? clientDataParts[2] ?? "",
    };
  }, [order]);

  console.log("DEBUG - Order ID:", orderId);
  console.log("DEBUG - Orders Response:", ordersResponse);
  console.log("DEBUG - Selected Order:", order);

  if (!isValidOrderId) return <ErrorMessage message="Invalid order ID." />;
  if (isOrdersLoading) return <Loader fullPage />;
  if (isOrdersError) {
    console.error("Orders fetch error:", ordersErrorData);
    return <ErrorMessage message="Failed to load orders. Please try again." />;
  }
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ErrorMessage message="Order not found in New status. Try checking other order lists." />
        <button
          onClick={() => router.push(ROUTES.ORDERS)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const { clientName, clientPhone1, clientPhone2 } = clientInfo;
  const orderStatus = order.orderStatus ?? ORDER_STATUSES.NEW;
  const orderCreatedDate = order.createdDate ?? "N/A";
  const orderCost = order.orderCost ?? 0;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-primary/10 rounded-lg">
              <PackageCheck className="w-5 h-5 text-primary" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">
              Order <span className="text-primary">#{order.serialNumber ?? orderId}</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Placed on {orderCreatedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(ROUTES.ORDERS)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-transparent p-5 border-b border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Order Logistics
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Destination</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {[order.governrate, order.city].filter(Boolean).join(", ") || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">
                    {orderCost.toLocaleString()} <span className="text-xs font-normal text-gray-500">EGP</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Status</p>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                        ORDER_STATUS_COLORS[orderStatus as keyof typeof ORDER_STATUS_COLORS] ??
                          "bg-gray-100 text-gray-600"
                      )}
                    >
                      {ORDER_STATUS_LABELS[orderStatus as keyof typeof ORDER_STATUS_LABELS] ?? "Status Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50/50 to-transparent p-5 border-b border-gray-50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Customer Details
              </h3>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                  Full Name
                </p>
                <p className="text-sm font-bold text-gray-900 uppercase">{clientName || "—"}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">Primary Contact</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {clientPhone1 || "—"}
                </p>
              </div>

              {clientPhone2 ? (
                <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 sm:col-span-2">
                  <p className="text-xs font-medium text-gray-400 mb-1">Alternative Contact</p>
                  <p className="text-sm font-semibold text-gray-700">{clientPhone2}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-sm font-bold text-gray-900">Items Summary</h3>
            </div>
            <div className="p-2">
              <OrderProductsList products={orderProducts} orderId={orderId} isEditing={true} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 sticky top-6">
            <h3 className="text-sm font-bold text-gray-900 mb-6 border-b pb-4">Order Actions</h3>

            <div className="space-y-3">
              <button
                onClick={() => router.push(ROUTES.ORDERS)}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Return to Dashboard
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-[10px] text-center text-gray-400 leading-relaxed uppercase tracking-widest font-bold">
                  Last updated by System at <br /> {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
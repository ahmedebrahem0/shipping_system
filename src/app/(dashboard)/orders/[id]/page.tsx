"use client";

import { useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useGetDeliveryOrdersQuery,
  useGetMerchantOrdersQuery,
  useGetMerchantsQuery,
  useGetOrdersQuery,
  useGetProductByIdQuery,
} from "@/store/slices/api/apiSlice";
import OrderProductsList from "@/features/orders/components/OrderProductsList";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { ORDER_STATUSES } from "@/constants/orderStatuses";
import type { Merchant } from "@/types/merchant.types";
import type { OrderListItem, OrdersResponse, Product } from "@/types/order.types";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  Hash,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  User,
  Sparkles,
  ShieldCheck,
  Boxes,
} from "lucide-react";

function parseClientData(clientData?: string) {
  const parts = clientData?.split("\n") ?? [];
  return {
    name: parts[0] ?? "",
    phone1: parts[1] ?? "",
    phone2: parts[2] ?? "",
  };
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const routeOrderId = Array.isArray(id) ? id[0] : id;
  const orderId = Number(routeOrderId);
  const isValidOrderId = Number.isFinite(orderId) && orderId > 0;

  const isAdmin = user?.role?.toLowerCase() === ROLES.ADMIN.toLowerCase();
  const isEmployee = user?.role?.toLowerCase() === ROLES.EMPLOYEE.toLowerCase();
  const isMerchant = user?.role?.toLowerCase() === ROLES.MERCHANT.toLowerCase();
  const isDelivery = user?.role?.toLowerCase() === ROLES.DELIVERY.toLowerCase();
  const scopedStatus = searchParams.get("status") || (isMerchant ? ORDER_STATUSES.NEW : "");

  const { data: merchantsRes, isLoading: isMerchantsLoading } = useGetMerchantsQuery(
    { pageSize: 1000 },
    { skip: !isMerchant }
  );

  const merchants = useMemo<Merchant[]>(
    () => merchantsRes?.data?.merchants || [],
    [merchantsRes]
  );

  const currentMerchant = useMemo(
    () =>
      merchants.find(
        (merchant) =>
          merchant.email?.toLowerCase() === user?.email?.toLowerCase()
      ) ?? null,
    [merchants, user?.email]
  );

  const merchantId = currentMerchant?.id ?? 0;

  const {
    data: allOrdersResponse,
    isLoading: isAllOrdersLoading,
    isError: isAllOrdersError,
  } = useGetOrdersQuery(
    { status: scopedStatus, filters: { page: 1, pageSize: 1000 } },
    { skip: !isValidOrderId || (!isAdmin && !isEmployee) }
  );

  const {
    data: merchantOrdersResponse,
    isLoading: isMerchantOrdersLoading,
    isError: isMerchantOrdersError,
    error: merchantOrdersError,
  } = useGetMerchantOrdersQuery(
    {
      merchantId,
      status: scopedStatus,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !isValidOrderId || !isMerchant || !merchantId }
  );

  const {
    data: deliveryOrdersResponse,
    isLoading: isDeliveryOrdersLoading,
    isError: isDeliveryOrdersError,
  } = useGetDeliveryOrdersQuery(
    {
      deliveryId: Number(user?.id),
      status: scopedStatus,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !isValidOrderId || !isDelivery }
  );

  const normalizedMerchantOrdersResponse = useMemo<OrdersResponse | undefined>(() => {
    if (merchantOrdersResponse) return merchantOrdersResponse;
    if (merchantOrdersError && typeof merchantOrdersError === "object" && "data" in merchantOrdersError) {
      return (merchantOrdersError as { data?: OrdersResponse }).data;
    }
    return undefined;
  }, [merchantOrdersResponse, merchantOrdersError]);

  const ordersResponse = isMerchant
    ? normalizedMerchantOrdersResponse
    : isDelivery
    ? deliveryOrdersResponse
    : allOrdersResponse;

  const orders = useMemo<OrderListItem[]>(
    () => (ordersResponse?.data?.orders ?? []) as OrderListItem[],
    [ordersResponse]
  );

  const order = useMemo(
    () => orders.find((item) => item.id === orderId) ?? null,
    [orders, orderId]
  );

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductByIdQuery(orderId, { skip: !isValidOrderId });

  const orderProducts = useMemo(
    () => (product && !product.isDeleted ? [product] : []) as Product[],
    [product]
  );

  const clientInfo = useMemo(() => parseClientData(order?.clientData), [order?.clientData]);

  const isLoading =
    isMerchantsLoading ||
    isAllOrdersLoading ||
    isMerchantOrdersLoading ||
    isDeliveryOrdersLoading ||
    isProductLoading;

  const isOrdersError = isMerchant
    ? Boolean(!normalizedMerchantOrdersResponse && isMerchantOrdersError)
    : isDelivery
    ? isDeliveryOrdersError
    : isAllOrdersError;

  console.log("DEBUG - Order ID:", orderId);
  console.log("DEBUG - Scoped Status:", scopedStatus);
  console.log("DEBUG - Orders Response:", ordersResponse);
  console.log("DEBUG - Product Response:", product);
  console.log("DEBUG - Selected Order:", order);

  if (!isValidOrderId) return <ErrorMessage message="Invalid order ID." />;
  if (isLoading) return <Loader fullPage />;
  if (isOrdersError) {
    return <ErrorMessage message="Failed to load order summary. Please try again." />;
  }
  if (!order) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <ErrorMessage message="Order not found in the current account scope." />
        <button
          onClick={() => router.push(ROUTES.ORDERS)}
          className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#0a1120_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
        <div className="relative p-6 md:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_24%)]" />
          <div className="relative z-10 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                <ShoppingBag className="h-3.5 w-3.5" />
                Order Snapshot
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  Order #{order.serialNumber}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Lightweight order details built from order summary data and linked product details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Order ID
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{order.id}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{order.createdDate || "N/A"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Scope
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {isMerchant ? "Merchant" : isDelivery ? "Delivery" : "System"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Banknote className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Summary
                </span>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Order Cost
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-emerald-400">
                  {order.orderCost.toLocaleString()}
                  <span className="ml-1 text-sm font-semibold text-slate-400">EGP</span>
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-white/[0.04] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {clientInfo.name || "—"}
                  </p>
                </div>

                <button
                  onClick={() => router.push(ROUTES.ORDERS)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/[0.1]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-primary/5 via-sky-50/40 to-transparent px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
                <Hash className="h-4 w-4 text-primary" />
                Order Summary
              </h3>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                Core Data
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Destination
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {[order.governrate, order.city].filter(Boolean).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Order Cost
                    </p>
                    <p className="mt-1 text-lg font-black text-emerald-600">
                      {order.orderCost.toLocaleString()}
                      <span className="ml-1 text-xs font-semibold text-gray-500">EGP</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Created Date
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {order.createdDate || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                      Order ID
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{order.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50/70 via-transparent to-transparent px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
                <User className="h-4 w-4 text-indigo-500" />
                Customer Details
              </h3>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-500">
                Contact
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                  Full Name
                </p>
                <p className="mt-2 text-sm font-black uppercase text-gray-900">
                  {clientInfo.name || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                  Primary Contact
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Phone className="h-3.5 w-3.5 text-indigo-400" />
                  {clientInfo.phone1 || "—"}
                </p>
              </div>

              {clientInfo.phone2 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                    Alternative Contact
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {clientInfo.phone2}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/40 px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-gray-900">
                <Boxes className="h-4 w-4 text-primary" />
                Linked Product Details
              </h3>
              {isProductError && (
                <span className="text-xs font-semibold text-amber-600">
                  Product details are unavailable for this ID.
                </span>
              )}
            </div>
            <div className="p-2">
              <OrderProductsList products={orderProducts} orderId={orderId} isEditing={true} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-md">
            <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <h3 className="text-sm font-black text-gray-900">Quick Context</h3>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Data Sources
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  Order summary comes from the scoped orders list. Product details come from the linked product lookup using this order ID.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Serial Number
                </p>
                <p className="mt-2 text-base font-black text-gray-900">
                  #{order.serialNumber}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Customer
                </p>
                <p className="mt-2 text-sm font-bold text-gray-900">
                  {clientInfo.name || "—"}
                </p>
              </div>

              <button
                onClick={() => router.push(ROUTES.ORDERS)}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.99]"
              >
                Return to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
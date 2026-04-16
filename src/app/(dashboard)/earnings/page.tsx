"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wallet,
  CalendarDays,
  TrendingUp,
  Truck,
  Map as MapIcon,
  MapPin,
  Package,
} from "lucide-react";
import {
  useGetDeliveriesQuery,
  useGetDeliveryOrdersQuery,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils/cn";
import { ORDER_STATUSES } from "@/constants/orderStatuses";
import type { Delivery } from "@/types/delivery.types";
import type { OrderListItem, OrdersResponse } from "@/types/order.types";

type PeriodKey = "today" | "week" | "month";

const PERIOD_OPTIONS: { key: PeriodKey; label: string; description: string }[] = [
  {
    key: "today",
    label: "Today",
    description: "Focus on deliveries completed today.",
  },
  {
    key: "week",
    label: "This Week",
    description: "Review your current weekly collection trend.",
  },
  {
    key: "month",
    label: "This Month",
    description: "Track your month-to-date delivery earnings.",
  },
];

function parseOrderDate(dateValue: string) {
  const directDate = new Date(dateValue);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const normalizedValue = dateValue
    .trim()
    .replace(/\.(?=\d{2}(\D|$))/g, ":")
    .replace(/\s+/g, " ");

  const normalizedDate = new Date(normalizedValue);
  if (!Number.isNaN(normalizedDate.getTime())) {
    return normalizedDate;
  }

  const match = normalizedValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T](\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*(AM|PM)?)?$/i
  );

  if (match) {
    const [, dayStr, monthStr, yearStr, hourStr, minuteStr, secondStr, meridiem] = match;
    let hours = Number(hourStr || 0);
    const minutes = Number(minuteStr || 0);
    const seconds = Number(secondStr || 0);

    if (meridiem) {
      const upperMeridiem = meridiem.toUpperCase();
      if (upperMeridiem === "PM" && hours < 12) hours += 12;
      if (upperMeridiem === "AM" && hours === 12) hours = 0;
    }

    return new Date(
      Number(yearStr),
      Number(monthStr) - 1,
      Number(dayStr),
      hours,
      minutes,
      seconds
    );
  }

  return new Date(NaN);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getClientName(clientData?: string) {
  return clientData?.split("\n")[0] || "Unknown";
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInCurrentWeek(date: Date, now: Date) {
  const currentDay = now.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() + diffToMonday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return date >= startOfWeek && date < endOfWeek;
}

function isInCurrentMonth(date: Date, now: Date) {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

function normalizeOrdersResponse(
  data?: OrdersResponse,
  error?: unknown
): OrdersResponse | undefined {
  if (data) return data;
  if (error && typeof error === "object" && "data" in error) {
    return (error as { data?: OrdersResponse }).data;
  }
  return undefined;
}

export default function EarningsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const searchParams = useSearchParams();
  const periodParam = searchParams.get("period");
  const sectionParam = searchParams.get("section");
  const period: PeriodKey =
    periodParam === "week" || periodParam === "month" || periodParam === "today"
      ? periodParam
      : "today";

  const { data: deliveriesRes, isLoading: deliveriesLoading } = useGetDeliveriesQuery(
    undefined,
    { skip: user?.role?.toLowerCase() !== "delivery" }
  );

  const deliveries = useMemo<Delivery[]>(() => {
    if (Array.isArray(deliveriesRes)) return deliveriesRes;
    if (
      deliveriesRes &&
      typeof deliveriesRes === "object" &&
      "data" in deliveriesRes &&
      Array.isArray((deliveriesRes as { data?: Delivery[] }).data)
    ) {
      return (deliveriesRes as { data?: Delivery[] }).data || [];
    }
    return [];
  }, [deliveriesRes]);

  const currentDelivery = useMemo(
    () =>
      deliveries.find(
        (delivery) =>
          delivery.email?.toLowerCase() === user?.email?.toLowerCase()
      ) ?? null,
    [deliveries, user?.email]
  );

  const deliveryId = currentDelivery?.id ?? 0;

  const deliveredQuery = useGetDeliveryOrdersQuery(
    {
      deliveryId,
      status: ORDER_STATUSES.DELIVERED,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !deliveryId }
  );

  const partialDeliveredQuery = useGetDeliveryOrdersQuery(
    {
      deliveryId,
      status: ORDER_STATUSES.PARTIALLY_DELIVERED,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !deliveryId }
  );

  const paidRejectedQuery = useGetDeliveryOrdersQuery(
    {
      deliveryId,
      status: ORDER_STATUSES.REJECTED_WITH_PAYMENT,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !deliveryId }
  );

  const partialPaidRejectedQuery = useGetDeliveryOrdersQuery(
    {
      deliveryId,
      status: ORDER_STATUSES.REJECTED_WITH_PARTIAL_PAYMENT,
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !deliveryId }
  );

  const allCompletedOrders = useMemo<OrderListItem[]>(() => {
    const merged = [
      ...(normalizeOrdersResponse(deliveredQuery.data, deliveredQuery.error)?.data?.orders || []),
      ...(normalizeOrdersResponse(partialDeliveredQuery.data, partialDeliveredQuery.error)?.data?.orders || []),
      ...(normalizeOrdersResponse(paidRejectedQuery.data, paidRejectedQuery.error)?.data?.orders || []),
      ...(normalizeOrdersResponse(partialPaidRejectedQuery.data, partialPaidRejectedQuery.error)?.data?.orders || []),
    ];

    const uniqueMap = new Map<number, OrderListItem>();
    merged.forEach((order) => {
      uniqueMap.set(order.id, order);
    });

    return Array.from(uniqueMap.values());
  }, [
    deliveredQuery.data,
    deliveredQuery.error,
    partialDeliveredQuery.data,
    partialDeliveredQuery.error,
    paidRejectedQuery.data,
    paidRejectedQuery.error,
    partialPaidRejectedQuery.data,
    partialPaidRejectedQuery.error,
  ]);

  const isLoading =
    deliveriesLoading ||
    deliveredQuery.isLoading ||
    partialDeliveredQuery.isLoading ||
    paidRejectedQuery.isLoading ||
    partialPaidRejectedQuery.isLoading;

  const scopedOrders = useMemo(() => {
    const now = new Date();
    return allCompletedOrders.filter((order) => {
      const orderDate = parseOrderDate(order.createdDate);
      if (Number.isNaN(orderDate.getTime())) return false;

      if (period === "today") return isSameDay(orderDate, now);
      if (period === "week") return isInCurrentWeek(orderDate, now);
      return isInCurrentMonth(orderDate, now);
    });
  }, [allCompletedOrders, period]);

  const totalEarnings = useMemo(
    () => scopedOrders.reduce((sum, order) => sum + (order.orderCost || 0), 0),
    [scopedOrders]
  );

  const averageTicket = scopedOrders.length ? totalEarnings / scopedOrders.length : 0;
  const coveredCities = new Set(scopedOrders.map((order) => order.city)).size;

  const latestCollections = useMemo(() => {
    return [...scopedOrders]
      .sort(
        (a, b) =>
          parseOrderDate(b.createdDate).getTime() -
          parseOrderDate(a.createdDate).getTime()
      )
      .slice(0, 8);
  }, [scopedOrders]);

  const areaEntries = currentDelivery?.governmentName || [];
  const shouldHighlightAreas = sectionParam === "areas";
  const currentPeriodMeta =
    PERIOD_OPTIONS.find((option) => option.key === period) || PERIOD_OPTIONS[0];

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#111827_52%,#0a1120_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
        <div className="relative p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%)]" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
                <Wallet className="h-3.5 w-3.5" />
                Delivery Earnings
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white lg:text-3xl">
                  {currentDelivery?.name || "Delivery"} financial workspace
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  {currentPeriodMeta.description} This page merges your earnings view and assigned areas into one workspace so the delivery team has one place to check collections and coverage.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Active Branch
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {currentDelivery?.branchName || "No branch assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {PERIOD_OPTIONS.map((option) => {
          const href = `/earnings?period=${option.key}`;
          const isActive = period === option.key;

          return (
            <a
              key={option.key}
              href={href}
              className={cn(
                "rounded-2xl border px-4 py-4 transition-all",
                isActive
                  ? "border-primary bg-primary/10 text-white shadow-lg shadow-primary/10"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-primary/40 hover:bg-white/[0.06]"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-xl p-2",
                    isActive ? "bg-primary text-white" : "bg-white/10 text-sky-300"
                  )}
                >
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black">{option.label}</p>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Earnings
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Completed Orders
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {scopedOrders.length}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Avg Collection
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {formatCurrency(averageTicket)}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a1120] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Covered Cities
              </p>
              <p className="mt-2 text-2xl font-black text-white">
                {coveredCities}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-300">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-[#0a1120] p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Recent collections</h2>
              <p className="text-sm text-slate-400">
                Latest completed and payable orders in the selected period.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-400">
              {currentPeriodMeta.label}
            </div>
          </div>

          {latestCollections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
              <Truck className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-4 text-sm font-bold text-white">
                No collections in this period
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Switch the period from the cards above to inspect another range.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestCollections.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div>
                    <p className="text-sm font-black text-white">
                      #{order.serialNumber}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {getClientName(order.clientData)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.governrate} / {order.city}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-300">
                      {formatCurrency(order.orderCost)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {parseOrderDate(order.createdDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={cn(
            "rounded-3xl border bg-[#0a1120] p-6 transition-all",
            shouldHighlightAreas
              ? "border-primary shadow-[0_0_0_1px_rgba(14,165,233,0.25)]"
              : "border-white/10"
          )}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Assigned areas</h2>
              <p className="text-sm text-slate-400">
                Regions currently assigned to this delivery account.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Branch
            </p>
            <p className="mt-2 text-base font-black text-white">
              {currentDelivery?.branchName || "No branch assigned"}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {areaEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-slate-500">
                No assigned governments are available for this account yet.
              </div>
            ) : (
              areaEntries.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-500/10 p-2 text-sky-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{area}</p>
                      <p className="text-xs text-slate-500">
                        Delivery coverage area
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import {
  Package,
  DollarSign,
  TrendingUp,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import {
  useGetMerchantOrdersQuery,
  useGetMerchantsQuery,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";
import type { OrderListItem, OrdersResponse } from "@/types/order.types";
import type { Merchant } from "@/types/merchant.types";
import { StatCard } from "../shared/StatCard";

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

export function MerchantDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: merchantsRes, isLoading: merchantsLoading } = useGetMerchantsQuery({
    pageSize: 1000,
  });
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
    data: ordersRes,
    isLoading: ordersLoading,
    error: ordersError,
    isUninitialized,
  } = useGetMerchantOrdersQuery(
    {
      merchantId,
      status: "New",
      filters: { page: 1, pageSize: 1000 },
    },
    { skip: !merchantId }
  );

  const normalizedOrdersRes = useMemo<OrdersResponse | undefined>(() => {
    if (ordersRes) return ordersRes;
    if (ordersError && typeof ordersError === "object" && "data" in ordersError) {
      return (ordersError as { data?: OrdersResponse }).data;
    }
    return undefined;
  }, [ordersRes, ordersError]);

  const isLoading = merchantsLoading || ordersLoading;

  useEffect(() => {
    console.group("MERCHANT DASHBOARD DEBUG");
    console.log("Merchant user:", user);
    console.log("Merchants API response:", merchantsRes);
    console.log("Matched merchant entity:", currentMerchant);
    console.log("Merchant ID used in query:", merchantId);
    console.log("Merchant orders response:", ordersRes);
    console.log("Merchant normalized orders response:", normalizedOrdersRes);
    console.log("Merchant orders error:", ordersError);
    console.log("Merchant orders isUninitialized:", isUninitialized);
    console.groupEnd();
  }, [user, merchantsRes, currentMerchant, merchantId, ordersRes, normalizedOrdersRes, ordersError, isUninitialized]);

  const orders = useMemo<OrderListItem[]>(
    () => normalizedOrdersRes?.data?.orders || [],
    [normalizedOrdersRes]
  );

  // ================= KPIs =================
  const totalOrders = orders.length;

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.orderCost || 0), 0),
    [orders]
  );

  const avgOrderValue = totalOrders
    ? totalRevenue / totalOrders
    : 0;

  const uniqueCities = useMemo(() => {
    const set = new Set(orders.map(o => o.city));
    return set.size;
  }, [orders]);

  // ================= Orders per day =================
  const ordersByDay = useMemo(() => {
    const map: Record<string, number> = {
      Sat: 0,
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
    };

    orders.forEach((o) => {
      const date = parseOrderDate(o.createdDate);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (key in map) {
        map[key] += 1;
      }
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      orders: value,
    }));
  }, [orders]);

  // ================= City Distribution =================
  const cityDistribution = useMemo(() => {
    const map = new Map<string, number>();

    orders.forEach((o) => {
      const key = `${o.governrate} / ${o.city}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders]);

  // ================= Latest Orders =================
  const latestOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          parseOrderDate(b.createdDate).getTime() -
          parseOrderDate(a.createdDate).getTime()
      )
      .slice(0, 6);
  }, [orders]);

  if (isLoading) return null;

  return (
    <div className="space-y-6">

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Orders" value={totalOrders} icon={Package} color="sky" />
        <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} color="emerald" />
        <StatCard label="Avg Order" value={formatCurrency(avgOrderValue)} icon={TrendingUp} color="amber" />
        <StatCard label="Cities" value={uniqueCities} icon={MapPin} color="rose" />
      </div>

      {/* ================= Chart ================= */}
      <div className="bg-[#0a1120] rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">
          Orders Trend
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={ordersByDay}>
            <CartesianGrid stroke="#ffffff10" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Area dataKey="orders" stroke="#3b82f6" fill="#3b82f620" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ================= Sections ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Latest Orders */}
        <div className="bg-[#0a1120] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Latest Orders
          </h3>

          <div className="space-y-3">
            {latestOrders.map((o) => (
              <div
                key={o.id}
                className="flex justify-between items-center p-3 rounded-xl bg-white/5"
              >
                <div>
                  <p className="text-white text-sm font-bold">
                    #{o.serialNumber}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {getClientName(o.clientData)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-emerald-400 text-sm font-bold">
                    {formatCurrency(o.orderCost)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {o.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Distribution */}
        <div className="bg-[#0a1120] rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">
            Orders by City
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityDistribution}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useMemo } from "react";


import {
  Package,
  Users,
  Truck,
  GitBranch,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Globe,
  Server,
  Database,
  MapPin,
  ShoppingBag,
  CircleDollarSign,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
} from "recharts";
import {
  useGetOrdersQuery,
  useGetMerchantsQuery,
  useGetBranchesQuery,
  useGetDeliveriesQuery,
} from "@/store/slices/api/apiSlice";
import { StatCard } from "../shared/StatCard";
import { DashboardSkeleton } from "../shared/DashboardSkeleton";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";
import type { OrderListItem } from "@/types/order.types";
import type { Merchant } from "@/types/merchant.types";
import type { Branch } from "@/types/branch.types";
import type { Delivery } from "@/types/delivery.types";


function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getClientName(clientData?: string) {
  if (!clientData) return "Unknown Client";
  return clientData.split("\n")[0] || "Unknown Client";
}

// function getSafeArray<T>(value: unknown): T[] {
//   return Array.isArray(value) ? (value as T[]) : [];
// }

export function AdminDashboard() {
  const { data: ordersRes, isLoading: ordersLoading } = useGetOrdersQuery({
    status: "New",
    filters: { page: 1, pageSize: 1000 },
  });
  const { data: merchantsRes, isLoading: merchantsLoading } =
    useGetMerchantsQuery({ pageSize: 1000 });
  const { data: branchesRes, isLoading: branchesLoading } =
    useGetBranchesQuery({ pageSize: 1000 });
  const { data: deliveriesRes, isLoading: deliveriesLoading } =
    useGetDeliveriesQuery();

const orders = useMemo<OrderListItem[]>(
  () => ordersRes?.data?.orders || [],
  [ordersRes]
);

const merchants = useMemo<Merchant[]>(
  () => merchantsRes?.data?.merchants || [],
  [merchantsRes]
);

const branches = useMemo<Branch[]>(
  () => branchesRes?.data?.branches || [],
  [branchesRes]
);

 const deliveries = useMemo<Delivery[]>(
  () => deliveriesRes || [],
  [deliveriesRes]
);

  const activeMerchants = useMemo(
    () => merchants.filter((m) => !m.isDeleted),
    [merchants]
  );

  const activeBranches = useMemo(
    () => branches.filter((b) => !b.isDeleted),
    [branches]
  );

  const activeDeliveries = useMemo(
    () => deliveries.filter((d) => !d.isDeleted),
    [deliveries]
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + (Number(order.orderCost) || 0), 0),
    [orders]
  );

  const avgOrderValue = useMemo(
    () => (orders.length ? totalRevenue / orders.length : 0),
    [orders, totalRevenue]
  );

  const avgPickupCost = useMemo(() => {
    if (!activeMerchants.length) return 0;
    const sum = activeMerchants.reduce(
      (acc, merchant) => acc + (Number(merchant.pickupCost) || 0),
      0
    );
    return sum / activeMerchants.length;
  }, [activeMerchants]);

  const avgRejectedRate = useMemo(() => {
    if (!activeMerchants.length) return 0;
    const sum = activeMerchants.reduce(
      (acc, merchant) => acc + (Number(merchant.rejectedOrderPercentage) || 0),
      0
    );
    return sum / activeMerchants.length;
  }, [activeMerchants]);

  const avgCompanyPercentage = useMemo(() => {
    if (!activeDeliveries.length) return 0;
    const sum = activeDeliveries.reduce(
      (acc, delivery) => acc + (Number(delivery.companyPercentage) || 0),
      0
    );
    return sum / activeDeliveries.length;
  }, [activeDeliveries]);

  const coverageCount = useMemo(() => {
    const set = new Set<string>();
    activeDeliveries.forEach((delivery) => {
      (delivery.governmentName || []).forEach((gov) => {
        if (gov) set.add(gov);
      });
    });
    return set.size;
  }, [activeDeliveries]);

  const ordersByDay = useMemo(() => {
    const dayMap: Record<string, number> = {
      Sat: 0,
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
    };

    orders.forEach((order) => {
      const date = new Date(order.createdDate.replace(/\.(?=\d{2}(AM|PM))/i, ":"));
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      if (dayMap[day] !== undefined) {
        dayMap[day] += 1;
      }
    });

    return Object.entries(dayMap).map(([name, value]) => ({
      name,
      orders: value,
    }));
  }, [orders]);

  const latestOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aDate = new Date(a.createdDate.replace(/\.(?=\d{2}(AM|PM))/i, ":")).getTime();
        const bDate = new Date(b.createdDate.replace(/\.(?=\d{2}(AM|PM))/i, ":")).getTime();
        return bDate - aDate;
      })
      .slice(0, 6);
  }, [orders]);

  const topMerchants = useMemo(() => {
    const map = new Map<
      string,
      { name: string; orders: number; revenue: number; storeName: string }
    >();

    orders.forEach((order) => {
      const matchedMerchant =
        activeMerchants.find(
          (merchant) =>
            merchant.name?.toLowerCase() === getClientName(order.clientData).toLowerCase()
        ) ?? null;

      const merchantName = matchedMerchant?.name || "Unknown Merchant";
      const storeName = matchedMerchant?.storeName || "—";

      if (!map.has(merchantName)) {
        map.set(merchantName, {
          name: merchantName,
          storeName,
          orders: 0,
          revenue: 0,
        });
      }

      const current = map.get(merchantName)!;
      current.orders += 1;
      current.revenue += Number(order.orderCost) || 0;
    });

    const fallbackFromMerchants = activeMerchants.map((merchant) => ({
      name: merchant.name,
      storeName: merchant.storeName || "—",
      orders: 0,
      revenue: 0,
    }));

    const merged = [...fallbackFromMerchants];

    Array.from(map.values()).forEach((item) => {
      const existingIndex = merged.findIndex((m) => m.name === item.name);
      if (existingIndex >= 0) {
        merged[existingIndex] = item;
      } else {
        merged.push(item);
      }
    });

    return merged
      .sort((a, b) => b.revenue - a.revenue || b.orders - a.orders)
      .slice(0, 5);
  }, [orders, activeMerchants]);

  const cityDistribution = useMemo(() => {
    const map = new Map<string, number>();

    orders.forEach((order) => {
      const key = `${order.governrate || "Unknown"} / ${order.city || "Unknown"}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders]);

  const merchantHealth = useMemo(() => {
    return activeMerchants
      .map((merchant) => ({
        name: merchant.name,
        rejectedRate: Number(merchant.rejectedOrderPercentage) || 0,
        pickupCost: Number(merchant.pickupCost) || 0,
      }))
      .sort((a, b) => b.rejectedRate - a.rejectedRate)
      .slice(0, 5);
  }, [activeMerchants]);

  const deliveryCoverage = useMemo(() => {
    return activeDeliveries.slice(0, 6).map((delivery) => ({
      id: delivery.id,
      name: delivery.name,
      branchName: delivery.branchName || "—",
      discountType: delivery.discountType || "—",
      companyPercentage: delivery.companyPercentage || 0,
      governments: (delivery.governmentName || []).join(", ") || "—",
    }));
  }, [activeDeliveries]);

  const systemStatus = useMemo(
    () => [
      {
        label: "Global Reach",
        val: `${coverageCount} Areas`,
        icon: Globe,
        color: "text-sky-300",
        badgeClass: "bg-sky-700 text-white",
      },
      {
        label: "Server Load",
        val: orders.length > 0 ? "Operational" : "Idle",
        icon: Server,
        color: "text-emerald-300",
        badgeClass: "bg-emerald-700 text-white",
      },
      {
        label: "Database",
        val: "Synced",
        icon: Database,
        color: "text-violet-300",
        badgeClass: "bg-violet-700 text-white",
      },
    ],
    [coverageCount, orders.length]
  );

  const isLoading =
    ordersLoading || merchantsLoading || branchesLoading || deliveriesLoading;

  if (isLoading) {
    return <DashboardSkeleton variant="stats" count={4} />;
  }
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-5 animate-in fade-in duration-500 dark:bg-[#0e1227] lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Orders"
          value={ordersRes?.data?.totalOrders || orders.length}
          icon={Package}
          color="sky"
          trend={12}
          href={ROUTES.ORDERS}
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={CircleDollarSign}
          color="emerald"
          trend={8}
        />
        <StatCard
          label="Active Merchants"
          value={activeMerchants.length}
          icon={Users}
          color="amber"
          trend={5}
          href={ROUTES.MERCHANTS}
        />
        <StatCard
          label="Branches"
          value={activeBranches.length}
          icon={GitBranch}
          color="rose"
          href={ROUTES.BRANCHES}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-[#0a1120]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black tracking-tight italic text-slate-900 dark:text-white">
                Performance Flow
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-100">
                Weekly order activity from live data
              </p>
            </div>
            <Activity className="text-blue-500 w-5 h-5 opacity-50" />
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersByDay}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.18)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: "#0f172a",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#chartColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-blue-100 p-6 shadow-2xl dark:from-blue-700 dark:via-indigo-800 dark:to-slate-900 xl:col-span-4">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div className="rounded-xl bg-white/80 p-3 backdrop-blur-md dark:bg-white/10">
                <TrendingUp className="h-5 w-5 text-sky-700 dark:text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-900 dark:text-white/80">
                Efficiency
              </span>
            </div>

            <div className="mt-8">
              <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                {orders.length ? "98.2%" : "0%"}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white">
                Operational Success Rate
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur dark:bg-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                  Avg Order Value
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {formatCurrency(avgOrderValue)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur dark:bg-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                  Avg Pickup Cost
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {formatCurrency(avgPickupCost)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/85 px-4 py-3 backdrop-blur dark:bg-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                  Delivery Margin
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {avgCompanyPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <button className="relative z-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-700 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-sky-800 dark:bg-white dark:text-blue-900 dark:hover:bg-blue-50">
            Generate Report <ArrowUpRight className="w-4 h-4" />
          </button>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systemStatus.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0a1120] dark:hover:bg-[#11182a]"
          >
            <div className="flex items-center gap-3">
              <div className={cn("rounded-lg bg-slate-100 p-2 dark:bg-white/5", item.color)}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight text-slate-700 dark:text-slate-50">
                {item.label}
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-widest",
                item.badgeClass
              )}
            >
              {item.val}
            </span>
          </div>
        ))}
      </div>



      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
  {/* Latest Orders */}
  <div className="2xl:col-span-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,#0f172a_0%,#0a1120_100%)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
          Latest Orders
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-100">
          Recent shipping activity
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-100 text-sky-700 shadow-inner shadow-sky-200/60 dark:border-sky-700 dark:bg-sky-800 dark:text-sky-100 dark:shadow-sky-950/30">
        <ShoppingBag className="h-5 w-5" />
      </div>
    </div>

    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {latestOrders.length ? (
        latestOrders.map((order, index) => (
          <div
            key={order.id}
            className="group grid grid-cols-1 gap-4 px-6 py-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-[#11182a] md:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 shadow-inner shadow-sky-200/60 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-100 dark:shadow-slate-950/30">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                  #{order.serialNumber}
                </p>
                <span className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-slate-700 dark:border-slate-500/50 dark:bg-slate-700 dark:text-white">
                  #{index + 1}
                </span>
              </div>

              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-100">
                {getClientName(order.clientData)}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-100">
                <span>{order.governrate}</span>
                <span className="text-slate-400 dark:text-slate-100">•</span>
                <span>{order.city}</span>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-1 md:items-end">
              <p className="text-sm font-black text-emerald-700 dark:text-emerald-200">
                {formatCurrency(order.orderCost)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-100">
                {order.createdDate}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-100">
            No recent orders available
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Orders by City */}
  <div className="2xl:col-span-5 rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0a1120]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
          Orders by City
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-100">
          Top active destinations
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-100 text-violet-700 shadow-inner shadow-violet-200/60 dark:border-violet-700 dark:bg-violet-800 dark:text-violet-100 dark:shadow-violet-950/30">
        <MapPin className="h-5 w-5" />
      </div>
    </div>

    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={cityDistribution}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff08"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={130}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                fontSize: "12px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
  {/* Top Merchants */}
  <div className="xl:col-span-4 rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0a1120]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Top Merchants
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-100">
          Ranked by revenue
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-amber-700 shadow-inner shadow-amber-200/60 dark:border-amber-700 dark:bg-amber-800 dark:text-amber-100 dark:shadow-amber-950/30">
        <Building2 className="h-5 w-5" />
      </div>
    </div>

    <div className="space-y-3">
      {topMerchants.length ? (
        topMerchants.map((merchant, index) => (
          <div
            key={`${merchant.name}-${index}`}
            className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 px-1 text-xs font-black text-white">
                    {index + 1}
                  </span>
                  <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                    {merchant.name}
                  </p>
                </div>
                <p className="mt-1 truncate pl-9 text-xs text-slate-600 dark:text-slate-100">
                  {merchant.storeName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-emerald-700 dark:text-emerald-200">
                  {formatCurrency(merchant.revenue)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-100">
                  {merchant.orders} orders
                </p>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{
                  width: `${Math.min(
                    topMerchants[0]?.revenue
                      ? (merchant.revenue / topMerchants[0].revenue) * 100
                      : 0,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-slate-600 dark:text-slate-100">No merchant data available</div>
      )}
    </div>
  </div>

  {/* Merchant Health */}
  <div className="xl:col-span-4 rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0a1120]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Merchant Health
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-100">
          Rejection and pickup indicators
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 text-rose-700 shadow-inner shadow-rose-200/60 dark:border-rose-700 dark:bg-rose-800 dark:text-rose-100 dark:shadow-rose-950/30">
        <AlertTriangle className="h-5 w-5" />
      </div>
    </div>

    <div className="space-y-3">
      {merchantHealth.length ? (
        merchantHealth.map((merchant, index) => (
          <div
            key={`${merchant.name}-${index}`}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                {merchant.name}
              </p>
              <span className="rounded-full bg-rose-700 px-2.5 py-1 text-xs font-black text-white">
                {merchant.rejectedRate.toFixed(0)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400"
                style={{ width: `${Math.min(merchant.rejectedRate, 100)}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-100">Pickup Cost</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(merchant.pickupCost)}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-slate-600 dark:text-slate-100">No health metrics available</div>
      )}
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-100">
          Avg Reject
        </p>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
          {avgRejectedRate.toFixed(0)}%
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-100">
          Avg Pickup
        </p>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
          {formatCurrency(avgPickupCost)}
        </p>
      </div>
    </div>
  </div>

  {/* Delivery Coverage */}
  <div className="xl:col-span-4 rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0a1120]">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
          Delivery Coverage
        </h2> 
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-600 dark:text-slate-100">
          Branches, areas, and commission model
        </p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-100 text-sky-700 shadow-inner shadow-sky-200/60 dark:border-sky-700 dark:bg-sky-800 dark:text-sky-100 dark:shadow-sky-950/30">
        <Truck className="h-5 w-5" />
      </div>
    </div>

    <div className="space-y-3">
      {deliveryCoverage.length ? (
        deliveryCoverage.map((delivery) => (
          <div
            key={delivery.id}
            className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                  {delivery.name}
                </p>
                <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-100">
                  {delivery.branchName}
                </p>
              </div>

              <span className="rounded-full border border-sky-500/40 bg-sky-700 px-2.5 py-1 text-xs font-black uppercase tracking-widest text-white">
                {delivery.discountType}
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-700 dark:text-slate-100">
                {delivery.governments}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-100">
                Company %
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {delivery.companyPercentage}%
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-slate-600 dark:text-slate-100">
          No delivery coverage data available
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  );
}

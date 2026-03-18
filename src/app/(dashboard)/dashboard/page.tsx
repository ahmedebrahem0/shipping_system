// dashboard/page.tsx
// Main dashboard page - shows overview stats based on user role

"use client";

import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { Package, Users, Truck, GitBranch } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useGetDashboardStatsQuery } from "@/store/slices/api/apiSlice";

const statsSkeleton = Array.from({ length: 4 });

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-7 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  
  const isAdminOrEmployee = user?.role === ROLES.ADMIN || user?.role === ROLES.EMPLOYEE;
  const { data: statsData, isLoading, isError } = useGetDashboardStatsQuery(undefined, {
    skip: !isAdminOrEmployee,
  });

  console.log("Dashboard stats:", { statsData, isLoading, isError, isAdminOrEmployee, userRole: user?.role });

  const defaultStats = [
    {
      label: "Total Orders",
      value: statsData?.data?.totalOrders?.toLocaleString() ?? "-",
      icon: Package,
      color: "bg-orange-100 text-orange-600",
      href: ROUTES.ORDERS,
    },
    {
      label: "Total Merchants",
      value: statsData?.data?.totalMerchants?.toLocaleString() ?? "-",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      href: ROUTES.MERCHANTS,
    },
    {
      label: "Total Deliveries",
      value: statsData?.data?.totalDeliveries?.toLocaleString() ?? "-",
      icon: Truck,
      color: "bg-green-100 text-green-600",
      href: ROUTES.DELIVERIES,
    },
    {
      label: "Total Branches",
      value: statsData?.data?.totalBranches?.toLocaleString() ?? "-",
      icon: GitBranch,
      color: "bg-purple-100 text-purple-600",
      href: ROUTES.BRANCHES,
    },
  ];

  const showAdminStats = isAdminOrEmployee;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mt-1">
          Here is what is happening today.
        </p>
      </div>

      {/* Stats - Admin and Employee only */}
      {showAdminStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? statsSkeleton.map((_, i) => <StatCardSkeleton key={i} />)
            : defaultStats?.map((stat) => (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      )}

      {/* Merchant View */}
      {user?.role === ROLES.MERCHANT && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">My Orders</h2>
          <p className="text-sm text-gray-500">
            View and manage all your orders.
          </p>
          <Link
            href={ROUTES.ORDERS}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Package className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      )}

      {/* Delivery View */}
      {user?.role === ROLES.DELIVERY && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">My Deliveries</h2>
          <p className="text-sm text-gray-500">
            View and manage your assigned orders.
          </p>
          <Link
            href={ROUTES.ORDERS}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Truck className="w-4 h-4" />
            View My Orders
          </Link>
        </div>
      )}
    </div>
  );
}

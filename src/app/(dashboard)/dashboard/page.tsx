// dashboard/page.tsx
// Main dashboard page - shows overview stats based on user role

"use client";

import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { Package, Users, Truck, GitBranch } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const stats = [
  {
    label: "Total Orders",
    value: "1,284",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
    href: ROUTES.ORDERS,
  },
  {
    label: "Total Merchants",
    value: "142",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    href: ROUTES.MERCHANTS,
  },
  {
    label: "Total Deliveries",
    value: "38",
    icon: Truck,
    color: "bg-green-100 text-green-600",
    href: ROUTES.DELIVERIES,
  },
  {
    label: "Total Branches",
    value: "12",
    icon: GitBranch,
    color: "bg-purple-100 text-purple-600",
    href: ROUTES.BRANCHES,
  },
];

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here is what is happening today.
        </p>
      </div>

      {/* Stats - Admin and Employee only */}
      {[ROLES.ADMIN, ROLES.EMPLOYEE].includes(user?.role as never) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
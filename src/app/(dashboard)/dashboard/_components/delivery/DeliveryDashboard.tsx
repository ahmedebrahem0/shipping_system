"use client";

import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import {
  Package,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetDeliveryOrdersQuery,
  useChangeOrderStatusMutation,
  useGetDeliveriesQuery,
} from "@/store/slices/api/apiSlice";
import { DashboardSkeleton } from "../shared/DashboardSkeleton";
import { ROUTES } from "@/constants/routes";
import type { Delivery } from "@/types/delivery.types";
import type { OrderListItem } from "@/types/order.types";

function parseClientData(clientData: string): {
  name: string;
  phone1: string;
  phone2: string;
} {
  const parts = clientData?.split("\n") || [];
  return {
    name: parts[0]?.trim() || "",
    phone1: parts[1]?.trim() || "",
    phone2: parts[2]?.trim() || "",
  };
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString()} EGP`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface TaskCardProps {
  order: {
    id: number;
    serialNumber: string;
    clientData: string;
    city: string;
    governrate: string;
    orderCost: number;
    createdDate: string;
  };
  onDeliver: (orderId: number) => void;
  onReject: (orderId: number) => void;
  isUpdating: boolean;
}

function TaskCard({
  order,
  onDeliver,
  onReject,
  isUpdating,
}: TaskCardProps) {
  const client = parseClientData(order.clientData);

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm font-bold text-white">
            {order.serialNumber}
          </span>
          <span className="text-xs text-slate-500 ml-2">
            {formatDate(order.createdDate)}
          </span>
        </div>
        <span className="text-lg font-black text-emerald-400">
          {formatCurrency(order.orderCost)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-slate-300">
              {client.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {client.name || "Unknown Client"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{client.phone1 || "No phone"}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {order.city}, {order.governrate}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
        <button
          onClick={() => onDeliver(order.id)}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          Deliver
        </button>
        <button
          onClick={() => onReject(order.id)}
          disabled={isUpdating}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl font-bold hover:bg-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
}

export function DeliveryDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: deliveriesRes, isLoading: deliveriesLoading } =
    useGetDeliveriesQuery();

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

  const [changeStatus, { isLoading: isStatusChanging }] =
    useChangeOrderStatusMutation();

  const { data: ordersData, isLoading: ordersLoading, error: ordersError } =
    useGetDeliveryOrdersQuery(
      { deliveryId, status: "New" },
      { skip: !deliveryId }
    );

  useEffect(() => {
    console.group("DELIVERY DASHBOARD DEBUG");
    console.log("Delivery user:", user);
    console.log("Deliveries API response:", deliveriesRes);
    console.log("Matched delivery entity:", currentDelivery);
    console.log("Delivery ID used in query:", deliveryId);
    console.log("Delivery orders response:", ordersData);
    console.log("Delivery orders error:", ordersError);
    console.groupEnd();
  }, [user, deliveriesRes, currentDelivery, deliveryId, ordersData, ordersError]);

  const handleDeliver = async (orderId: number) => {
    if (!user?.id) return;
    try {
      await changeStatus({
        orderId,
        userId: user.id,
        newStatus: "Delivered",
      }).unwrap();
      toast.success("Order marked as delivered!");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleReject = async (orderId: number) => {
    if (!user?.id) return;
    try {
      await changeStatus({
        orderId,
        userId: user.id,
        newStatus: "RejectedAndNotPaid",
      }).unwrap();
      toast.success("Order marked as rejected!");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  if (deliveriesLoading || ordersLoading) {
    return (
      <div className="space-y-8">
        <DashboardSkeleton variant="stats" count={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 animate-pulse"
            >
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-4" />
              <div className="h-3 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const rawOrders = ordersData?.data?.orders || [];
  const orders: OrderListItem[] = rawOrders;
  const totalTasks = orders.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Package className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{totalTasks}</h3>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Today&apos;s Tasks
          </p>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">--</h3>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Delivered Today
          </p>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-rose-500/10">
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">--</h3>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Rejected Today
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Assigned Orders</h3>
            <p className="text-sm text-slate-400">
              Orders waiting for delivery
            </p>
          </div>
          <Link
            href={ROUTES.ORDERS}
            className="text-sky-400 text-sm font-bold hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-500" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              No Orders Assigned
            </h4>
            <p className="text-slate-400">
              You don&apos;t have any orders to deliver right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <TaskCard
                key={order.id}
                order={order}
                onDeliver={handleDeliver}
                onReject={handleReject}
                isUpdating={isStatusChanging}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Deliver Order</p>
              <p className="text-xs text-slate-400">
                Mark order as delivered when recipient receives it
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Reject Order</p>
              <p className="text-xs text-slate-400">
                Use when recipient refuses to accept the delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
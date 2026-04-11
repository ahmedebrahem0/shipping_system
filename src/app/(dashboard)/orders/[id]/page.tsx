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
import { 
  Hash, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Banknote, 
  ArrowLeft,
  PackageCheck
} from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const orderId = Number(id);

  // ==================== Data Fetching ====================
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const { orders } = useOrders();
  
  const order = orders.find((o) => o.id === orderId);
  const orderProducts = products?.filter((p) => p.orderId === orderId) ?? [];

  if (isLoading) return <Loader fullPage />;
  if (isError) return <ErrorMessage />;

  const [clientName, clientPhone1, clientPhone2] = order?.clientData?.split("\n") ?? [];

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-primary/10 rounded-lg">
              <PackageCheck className="w-5 h-5 text-primary" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">
              Order <span className="text-primary">#{order?.serialNumber ?? orderId}</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Placed on {order?.createdDate ?? "N/A"}
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
          
          {/* 1. Main Order Summary Card */}
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
                    {order?.governrate}, {order?.city}
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
                    {order?.orderCost?.toLocaleString()} <span className="text-xs font-normal text-gray-500">EGP</span>
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
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                      ORDER_STATUS_COLORS[order?.orderStatus as keyof typeof ORDER_STATUS_COLORS] ?? "bg-gray-100 text-gray-600"
                    )}>
                      {ORDER_STATUS_LABELS[order?.orderStatus as keyof typeof ORDER_STATUS_LABELS] ?? "Status Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Client Card */}
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
                <p className="text-sm font-bold text-gray-900 uppercase">{clientName ?? "—"}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">Primary Contact</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  {clientPhone1 ?? "—"}
                </p>
              </div>

              {clientPhone2 && (
                <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 sm:col-span-2">
                  <p className="text-xs font-medium text-gray-400 mb-1">Alternative Contact</p>
                  <p className="text-sm font-semibold text-gray-700">{clientPhone2}</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Products List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                <h3 className="text-sm font-bold text-gray-900">Items Summary</h3>
             </div>
            <div className="p-2">
              <OrderProductsList
                products={orderProducts}
                orderId={orderId}
                isEditing={true}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
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
                  Last updated by System at <br/> {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
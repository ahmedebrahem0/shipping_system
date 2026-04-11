"use client";

import { useEffect } from "react";
import { Plus, Search, Calendar, Filter, Hash, LayoutGrid, ListFilter } from "lucide-react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import OrderTable from "@/features/orders/components/OrderTable";
import AssignDeliveryModal from "@/features/orders/components/AssignDeliveryModal";
import RejectOrderModal from "@/features/orders/components/RejectOrderModal";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Pagination from "@/components/common/Pagination";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/constants/orderStatuses";
import { cn } from "@/lib/utils/cn";

const STATUS_TABS = [

  ORDER_STATUSES.NEW,
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.DELIVERED_TO_AGENT,
  ORDER_STATUSES.DELIVERED,
  ORDER_STATUSES.CANCELED_BY_RECIPIENT,
  ORDER_STATUSES.PARTIALLY_DELIVERED,
  ORDER_STATUSES.POSTPONED,
  ORDER_STATUSES.CANNOT_BE_REACHED,
  ORDER_STATUSES.REJECTED_AND_NOT_PAID,
  ORDER_STATUSES.REJECTED_WITH_PARTIAL_PAYMENT,
  ORDER_STATUSES.REJECTED_WITH_PAYMENT,
];

const getStatusLabel = (status: string) => {
  if (status === "") return "All Orders";
  return ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
};

export default function OrdersPage() {
  const {
    orders,
    totalOrders,
    isLoading,
    isError,
    isAdmin,
    isEmployee,
    isMerchant,
    isDelivery,
    selectedStatus,
    setSelectedStatus,
    filters,
    handleFilterChange,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedOrderId,
    setSelectedOrderId,
    handleDelete,
    isDeleting,
    isStatusOpen,
    setIsStatusOpen,
    handleChangeStatus,
    isChangingStatus,
    isAssignOpen,
    setIsAssignOpen,
    handleAssignDelivery,
    isAssigning,
    goToCreate,
    goToDetails,
  } = useOrders();

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    handleFilterChange("page", 1);
  };

  const currentLabel = getStatusLabel(selectedStatus);
  const isEmpty = orders.length === 0;
  const hasFilters = filters.searchTxt || filters.serialNum || filters.startDate || filters.endDate;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      
      {/* 1 & 2. Unified Header & Status Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden border-b-4 border-b-primary/10">
        {/* Upper Part: Title & Action Button */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-2xl">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium ml-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Manage and track your <span className="text-gray-900 font-bold underline decoration-primary/30">{totalOrders}</span> orders in real-time
            </p>
          </div>

          <button
            onClick={goToCreate}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create New Order
          </button>
        </div>

        {/* Lower Part: Status Grid (Integrated & Modern) */}
        <div className="p-6 bg-gray-50/40 border-t border-gray-50">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <ListFilter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Filter by Status</span>
            <div className="h-[1px] flex-1 bg-gray-200/50"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {STATUS_TABS.map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "px-3 py-3 rounded-xl text-[11px] font-bold transition-all duration-300 border text-center flex items-center justify-center min-h-[48px] relative group",
                    isActive 
                      ? "bg-white border-primary text-primary shadow-md ring-1 ring-primary/5" 
                      : "bg-white/50 border-gray-100 text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-white"
                  )}
                >
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
                  )}
                  {getStatusLabel(status)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Advanced Filters Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Filter className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">Search & Optimization</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Customer Details..."
              value={filters.searchTxt ?? ""}
              onChange={(e) => handleFilterChange("searchTxt", e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
            />
          </div>

          <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Serial Number..."
              value={filters.serialNum ?? ""}
              onChange={(e) => handleFilterChange("serialNum", e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-gray-600"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
            <Loader />
            <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">Loading orders data...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
            <EmptyState
              title="No Results Found"
              description={
                hasFilters
                  ? "We couldn't find any orders matching your specific search criteria."
                  : `There are no orders currently recorded under "${currentLabel}".`
              }
            />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <ErrorMessage />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="overflow-x-auto no-scrollbar">
              <OrderTable
                orders={orders}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
                isMerchant={isMerchant}
                isDelivery={isDelivery}
                selectedStatus={selectedStatus}
                onView={goToDetails}
                onDelete={(id) => {
                  setSelectedOrderId(id);
                  setIsDeleteOpen(true);
                }}
                onChangeStatus={(id) => {
                  setSelectedOrderId(id);
                  setIsStatusOpen(true);
                }}
                onAssignDelivery={(id) => {
                  setSelectedOrderId(id);
                  setIsAssignOpen(true);
                }}
              />
            </div>
            
            {/* Table Footer with Pagination */}
            <div className="p-6 bg-gray-50/30 border-t border-gray-50 mt-auto flex items-center justify-center">
              <Pagination
                currentPage={filters.page ?? 1}
                totalCount={totalOrders}
                pageSize={filters.pageSize ?? 10}
                onPageChange={(page) => handleFilterChange("page", page)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Dialogs & Modals */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Order"
        description="This action is irreversible. The order data will be permanently removed from our servers."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <RejectOrderModal
        isOpen={isStatusOpen}
        isLoading={isChangingStatus}
        onChangeStatus={handleChangeStatus}
        onClose={() => setIsStatusOpen(false)}
      />

      <AssignDeliveryModal
        isOpen={isAssignOpen}
        isLoading={isAssigning}
        onAssign={handleAssignDelivery}
        onClose={() => setIsAssignOpen(false)}
      />
    </div>
  );
}
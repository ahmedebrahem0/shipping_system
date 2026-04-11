"use client";

import { useEffect } from "react";
import { Plus, Search, Calendar, Filter, Hash, ListFilter, LayoutGrid } from "lucide-react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import OrderTable from "@/features/orders/components/OrderTable";
import AssignDeliveryModal from "@/features/orders/components/AssignDeliveryModal";
import RejectOrderModal from "@/features/orders/components/RejectOrderModal";
import PageHeader from "@/components/common/PageHeader";
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
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <PageHeader
        title="Orders Dashboard"
        description={`Manage and track your ${totalOrders} orders efficiently`}
        actionLabel="Create New Order"
        actionIcon={Plus}
        onAction={goToCreate}
      />

      {/* 2. Status Grid Section - NO SCROLL */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Quick Filter by Status</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {STATUS_TABS.map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={cn(
                  "px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 border text-center flex items-center justify-center min-h-[44px] relative overflow-hidden group",
                  isActive 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "bg-gray-50/50 border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary hover:bg-white"
                )}
              >
                {isActive && (
                    <span className="absolute top-0 left-0 w-1 h-full bg-white/20" />
                )}
                {getStatusLabel(status)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filters Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Filter className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-bold text-gray-700">Advanced Search</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Customer name..."
              value={filters.searchTxt ?? ""}
              onChange={(e) => handleFilterChange("searchTxt", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/30 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Serial number..."
              value={filters.serialNum ?? ""}
              onChange={(e) => handleFilterChange("serialNum", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/30 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/30 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/30 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Table Content Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <EmptyState
              title="No Orders Found"
              description={
                hasFilters
                  ? "We couldn't find any results matching your filters."
                  : `Currently, there are no orders with the status "${currentLabel}".`
              }
            />
          </div>
        ) : isError ? (
          <div className="p-20">
            <ErrorMessage />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="overflow-x-auto">
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
            
            {/* Pagination Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
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

      {/* Modals */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Order"
        description="Are you sure? This action cannot be undone."
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
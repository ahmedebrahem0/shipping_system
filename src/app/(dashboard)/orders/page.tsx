"use client";

import { Plus, Search, Calendar, Filter, Hash, LayoutGrid, ListFilter, ShieldCheck, Package, MapPin, DollarSign } from "lucide-react";
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
    orders, totalOrders, isLoading, isError, isAdmin, isEmployee, isMerchant, isDelivery, currentMerchant, currentDelivery,
    selectedStatus, setSelectedStatus, filters, handleFilterChange, isDeleteOpen, setIsDeleteOpen,
    setSelectedOrderId, handleDelete, isDeleting, isStatusOpen, setIsStatusOpen,
    handleChangeStatus, isChangingStatus, isAssignOpen, setIsAssignOpen, handleAssignDelivery,
    isAssigning, goToCreate, goToDetails,
  } = useOrders();

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setSelectedOrderId(null);
  };

  const closeStatusDialog = () => {
    setIsStatusOpen(false);
    setSelectedOrderId(null);
  };

  const closeAssignDialog = () => {
    setIsAssignOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    handleFilterChange("page", 1);
  };

  const currentLabel = getStatusLabel(selectedStatus);
  const isEmpty = orders.length === 0;
  const hasFilters = filters.searchTxt || filters.serialNum || filters.startDate || filters.endDate;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.orderCost || 0), 0);
  const uniqueCities = new Set(orders.map((order) => `${order.governrate}-${order.city}`)).size;
  const pageTitle = isMerchant
    ? "Merchant Orders"
    : isDelivery
    ? "Delivery Orders"
    : "Orders Dashboard";
  const pageDescription = isMerchant
    ? `Track only ${currentMerchant?.storeName || currentMerchant?.name || "your"} shipments with the same operational view.`
    : isDelivery
    ? `Track only ${currentDelivery?.name || "your"} assigned shipments with the same operational view.`
    : `Manage and track ${totalOrders} orders`;
  const emptyStateTitle = isMerchant || isDelivery
    ? "No orders available for this status"
    : "No Results Found";
  const emptyStateDescription = hasFilters
    ? "We couldn't find any orders matching your filters. Try clearing them."
    : isMerchant
    ? `The merchant view does not currently show any orders under "${currentLabel}". Try selecting another status or return to New Orders.`
    : isDelivery
    ? `The delivery view does not currently show any orders under "${currentLabel}". Try selecting another status or return to your active queue.`
    : `There are no orders currently marked as "${currentLabel}".`;

  return (
    <div className="space-y-4 lg:space-y-6 pb-10 animate-in fade-in duration-700">
      {(isMerchant || isDelivery) && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#0a1120_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
          <div className="themed-surface  relative p-5 lg:p-6 ">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {isMerchant ? "Merchant Scope" : "Delivery Scope"}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black tracking-tight text-white ">
                    {isMerchant
                      ? "Your orders workspace is isolated to this merchant account."
                      : "Your orders workspace is isolated to this delivery account."}
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-slate-400">
                    {isMerchant
                      ? "This page uses the same operational flow as the shared orders dashboard, but every record here is scoped to"
                      : "This page uses the same operational flow as the shared orders dashboard, but every record here is scoped to"}
                    <span className="font-bold text-slate-200">
                      {" "}
                      {isMerchant
                        ? currentMerchant?.storeName || currentMerchant?.name || "your merchant account"
                        : currentDelivery?.name || "your delivery account"}
                    </span>
                    .
                  </p>
                </div>

                {!isDelivery && (
                  <button
                    onClick={goToCreate}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                    Create New Order
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Visible Orders</p>
                      <p className="mt-2 text-2xl font-black text-white">{totalOrders}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-sky-500/10 p-3 text-sky-300">
                      <Package className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                        {isMerchant ? "Queue Value" : "Collection Value"}
                      </p>
                      <p className="mt-2 text-2xl font-black text-white">{totalRevenue.toLocaleString()} EGP</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-emerald-500/10 p-3 text-emerald-300">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Covered Cities</p>
                      <p className="mt-2 text-2xl font-black text-white">{uniqueCities}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-amber-500/10 p-3 text-amber-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 1 & 2. Header & Status Section */}
      <div className="themed-surface overflow-hidden rounded-xl lg:rounded-2xl">
        {/* Upper Part: Responsive Header */}
        <div className="p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="p-2 bg-primary/10 rounded-lg lg:rounded-xl">
                <LayoutGrid className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <h1 className="text-lg lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{pageTitle}</h1>
            </div>
            <p className="flex items-center gap-2 text-[11px] font-medium text-slate-600 lg:text-sm dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden xs:inline text-slate-600 dark:text-slate-400">
                {isMerchant
                  ? "Showing only merchant-scoped data"
                  : isDelivery
                  ? "Showing only delivery-scoped data"
                  : "Manage and track"}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">{isMerchant || isDelivery ? pageDescription : totalOrders}</span>
              {!isMerchant && !isDelivery && <span>orders</span>}
            </p>
          </div>

          {!isDelivery && (
            <button
              onClick={goToCreate}
              className="group flex items-center justify-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3.5 bg-primary text-white rounded-xl font-bold text-xs lg:text-sm hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 lg:w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Order</span>
            </button>
          )}
        </div>

        {/* Status Tabs - Scrollable on mobile, Grid on desktop */}
        <div className="themed-surface-header p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-3 lg:mb-4">
            <ListFilter className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              {isMerchant ? "Filter your orders by status" : "Filter by Status"}
            </span>
            <div className="h-[1px] flex-1 bg-gray-200/50"></div>
          </div>
          
          {/* Mobile: Horizontal Scroll | Desktop: Adaptive Grid */}
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 xl:grid-cols-6 gap-2 pb-2 lg:pb-0 no-scrollbar select-none">
            {STATUS_TABS.map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    "whitespace-nowrap lg:whitespace-normal px-4 lg:px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-[10px] lg:text-xs font-bold transition-all duration-200 border text-center flex items-center justify-center min-h-[40px] lg:min-h-[48px] relative flex-shrink-0 lg:flex-shrink",
                    isActive 
                      ? "bg-white border-primary text-primary shadow-sm ring-1 ring-primary/10" 
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:text-primary hover:border-primary/30 hover:bg-white dark:bg-slate-800/70 dark:border-slate-700 dark:text-slate-300"
                  )}
                >
                  {isActive && (
                    <span className="absolute top-0 -right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white shadow-sm" />
                  )}
                  {getStatusLabel(status)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Advanced Filters Section */}
      <div className="themed-surface rounded-xl p-4 lg:rounded-2xl lg:p-6">
        <div className="flex items-center gap-2 mb-4 lg:mb-6">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Filter className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300">Search & Advanced Filters</span>
        </div>
        
        {/* Responsive Filter Grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary dark:text-slate-400" />
            <input
              type="text"
              placeholder="Customer details..."
              value={filters.searchTxt ?? ""}
              onChange={(e) => handleFilterChange("searchTxt", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 lg:py-3.5 lg:text-sm dark:text-slate-100"
            />
          </div>

          <div className="relative group">
            <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary dark:text-slate-400" />
            <input
              type="text"
              placeholder="Serial number..."
              value={filters.serialNum ?? ""}
              onChange={(e) => handleFilterChange("serialNum", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 lg:py-3.5 lg:text-sm dark:text-slate-100"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary dark:text-slate-400" />
            <input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 lg:py-3.5 lg:text-sm dark:text-slate-100"
            />
          </div>

          <div className="relative group">
            <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary dark:text-slate-400" />
            <input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 lg:py-3.5 lg:text-sm dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* 4. Data Table Container */}
      <div className="themed-surface flex min-h-[450px] flex-col overflow-hidden rounded-xl lg:rounded-2xl">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 lg:p-20 gap-4">
            <Loader />
            <p className="animate-pulse text-xs font-bold uppercase tracking-widest text-slate-600 lg:text-sm dark:text-slate-400">Fetching orders...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 text-center">
            <EmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
            />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center p-10">
            <ErrorMessage />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Horizontal Scroll logic for the table */}
            <div className="overflow-x-auto min-w-0">
              <OrderTable
                orders={orders}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
                isMerchant={isMerchant}
                isDelivery={isDelivery}
                selectedStatus={selectedStatus}
                onView={(id) => goToDetails(id, selectedStatus)}
                onDelete={(id) => { setSelectedOrderId(id); setIsDeleteOpen(true); }}
                onChangeStatus={(id) => { setSelectedOrderId(id); setIsStatusOpen(true); }}
                onAssignDelivery={(id) => { setSelectedOrderId(id); setIsAssignOpen(true); }}
              />
            </div>
            
            {/* Pagination - Stacked or centered */}
            <div className="themed-surface-header mt-auto flex items-center justify-center p-4 lg:p-6">
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

      {/* 5. Modals - Same logic */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Order"
        description="Are you sure? This action will permanently remove the order from the database."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />

      <RejectOrderModal
        isOpen={isStatusOpen}
        isLoading={isChangingStatus}
        onChangeStatus={handleChangeStatus}
        onClose={closeStatusDialog}
      />

      <AssignDeliveryModal
        isOpen={isAssignOpen}
        isLoading={isAssigning}
        onAssign={handleAssignDelivery}
        onClose={closeAssignDialog}
      />
    </div>
  );
}

// orders/page.tsx
// Orders management page with status tabs, filters and actions

"use client";

import { Plus } from "lucide-react";
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

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Orders"
        description={`${totalOrders} orders total`}
        actionLabel="New Order"
        actionIcon={Plus}
        onAction={goToCreate}
      />

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            onClick={() => {
              setSelectedStatus(status);
              handleFilterChange("page", 1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === status
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchTxt ?? ""}
            onChange={(e) => handleFilterChange("searchTxt", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
          />
          <input
            type="text"
            placeholder="Serial number..."
            value={filters.serialNum ?? ""}
            onChange={(e) => handleFilterChange("serialNum", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
          />
          <input
            type="date"
            value={filters.startDate ?? ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
          />
          <input
            type="date"
            value={filters.endDate ?? ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try changing the status filter or create a new order."
          />
        ) : (
          <>
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
            <Pagination
              currentPage={filters.page ?? 1}
              totalCount={totalOrders}
              pageSize={filters.pageSize ?? 10}
              onPageChange={(page) => handleFilterChange("page", page)}
            />
          </>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Order"
        description="Are you sure you want to delete this order?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      {/* Change Status Modal */}
      <RejectOrderModal
        isOpen={isStatusOpen}
        isLoading={isChangingStatus}
        onChangeStatus={handleChangeStatus}
        onClose={() => setIsStatusOpen(false)}
      />

      {/* Assign Delivery Modal */}
      <AssignDeliveryModal
        isOpen={isAssignOpen}
        isLoading={isAssigning}
        onAssign={handleAssignDelivery}
        onClose={() => setIsAssignOpen(false)}
      />

    </div>
  );
}
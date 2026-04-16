// reports/page.tsx
// Order reports page with filters and pagination

"use client";

import { useReports } from "@/features/reports/hooks/useReports";
import ReportTable from "@/features/reports/components/ReportTable";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";
import { ORDER_STATUSES } from "@/constants/orderStatuses";
import { OrderReport } from "@/types/report.types";

export default function ReportsPage() {
  const {
    orders,
    totalOrders,
    isLoading,
    isError,
    filters,
    handleFilterChange,
  } = useReports();

  const searchValue = filters.searchTxt?.toLowerCase()?.trim();

const firstMatch = searchValue
  ? orders.find((o:OrderReport) => {
      return (
        o.serialNumber === searchValue ||
        o.clientName?.toLowerCase().includes(searchValue) ||
        o.merchantName?.toLowerCase().includes(searchValue)
      );
    })
  : null;

const displayedOrders = searchValue
  ? firstMatch
    ? [firstMatch]
    : []
  : orders;

  
  console.log("DEBUG - Reports Orders:", orders);
  console.log("DEBUG - Reports Displayed Orders:", displayedOrders);
  console.log("DEBUG - Reports Total Orders:", totalOrders);

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Orders Report"
        description={`${totalOrders} orders total`}
      />

      {/* Filters */}
      <div className="themed-surface mb-4 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={filters.searchTxt}
            onChange={(e) => handleFilterChange("searchTxt", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
          />

          {/* Status */}
          <select
            value={filters.orderStatus}
            onChange={(e) => handleFilterChange("orderStatus", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
          >
            <option value="">All Statuses</option>
            {Object.values(ORDER_STATUSES).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
          />

          {/* End Date */}
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
          />

        </div>
      </div>

      {/* Content */}
      <div className="themed-surface overflow-hidden rounded-xl">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try adjusting your filters."
          />
        ) : (
          <>
            <ReportTable orders={displayedOrders} />
            <Pagination
              currentPage={filters.page ?? 1}
              totalCount={totalOrders}
              pageSize={filters.pageSize ?? 10}
              onPageChange={(page) => handleFilterChange("page", page)}
            />
          </>
        )}
      </div>

    </div>
  );
}

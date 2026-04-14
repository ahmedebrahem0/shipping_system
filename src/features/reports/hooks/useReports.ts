// useReports.ts
// Handles order report data fetching with filters and pagination

import { useState } from "react";
import { useGetOrderReportQuery } from "@/store/slices/api/apiSlice";
import type { OrderReportFilters } from "@/types/report.types";

export const useReports = () => {
  const [filters, setFilters] = useState<OrderReportFilters>({
    page: 1,
    pageSize: 10,
    searchTxt: "",
    startDate: "",
    endDate: "",
    orderStatus: "",
  });

  const { data, isLoading, isError } = useGetOrderReportQuery();

  console.log("DEBUG - Reports API Response:", data);
  console.log("DEBUG - Reports Filters:", filters);
console.log("API RESPONSE:", data);
  const handleFilterChange = (key: keyof OrderReportFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  return {
    // Data
    orders: data?.data?.orders ?? [],
    totalOrders: data?.data?.totalOrders?? 0,
    isLoading,
    isError,

    // Filters
    filters,
    handleFilterChange,
  };
};

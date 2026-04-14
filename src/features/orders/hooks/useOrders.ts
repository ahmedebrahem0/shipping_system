// useOrders.ts
// Handles all order operations based on user role

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetOrdersQuery,
  useGetMerchantOrdersQuery,
  useGetDeliveryOrdersQuery,
  useDeleteOrderMutation,
  useChangeOrderStatusMutation,
  useAssignDeliveryMutation,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { ORDER_STATUSES } from "@/constants/orderStatuses";
import type { OrderFilters } from "@/types/order.types";
import { ROUTES } from "@/constants/routes";

export const useOrders = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [selectedStatus, setSelectedStatus] = useState<string>(ORDER_STATUSES.NEW);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    pageSize: 10,
  });

  // ==================== Fetch based on role ====================
  const isAdmin = user?.role?.toLowerCase() === ROLES.ADMIN.toLowerCase();
  const isEmployee = user?.role?.toLowerCase() === ROLES.EMPLOYEE.toLowerCase();
  const isMerchant = user?.role?.toLowerCase() === ROLES.MERCHANT.toLowerCase();
  const isDelivery = user?.role?.toLowerCase() === ROLES.DELIVERY.toLowerCase();

  const {
    data: allOrdersData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetOrdersQuery(
    { status: selectedStatus, filters },
    { skip: !isAdmin && !isEmployee }
  );

  const {
    data: merchantOrdersData,
    isLoading: isLoadingMerchant,
    isError: isErrorMerchant,
  } = useGetMerchantOrdersQuery(
    { merchantId: Number(user?.id), status: selectedStatus, filters },
    { skip: !isMerchant }
  );

  const {
    data: deliveryOrdersData,
    isLoading: isLoadingDelivery,
    isError: isErrorDelivery,
  } = useGetDeliveryOrdersQuery(
    { deliveryId: Number(user?.id), status: selectedStatus, filters },
    { skip: !isDelivery }
  );

  // ==================== Get correct data ====================
  const ordersData = isMerchant
    ? merchantOrdersData
    : isDelivery
    ? deliveryOrdersData
    : allOrdersData;

  const isLoading = isLoadingAll || isLoadingMerchant || isLoadingDelivery;
  const isError = isErrorAll || isErrorMerchant || isErrorDelivery;

  // ==================== Delete ====================
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    try {
      await deleteOrder({
        orderId: selectedOrderId,
        userId: user?.id,
      }).unwrap();
      toast.success("Order deleted successfully");
      setIsDeleteOpen(false);
      setSelectedOrderId(null);
    } catch {
      toast.error("Failed to delete order");
    }
  };

  // ==================== Change Status ====================
  const [changeStatus, { isLoading: isChangingStatus }] = useChangeOrderStatusMutation();

  const handleChangeStatus = async (newStatus: string, note?: string) => {
    if (!selectedOrderId || !user?.id) return;
    try {
      await changeStatus({
        orderId: selectedOrderId,
        userId: user.id,
        newStatus,
        note,
      }).unwrap();
      toast.success("Order status updated successfully");
      setIsStatusOpen(false);
      setSelectedOrderId(null);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  // ==================== Assign Delivery ====================
  const [assignDelivery, { isLoading: isAssigning }] = useAssignDeliveryMutation();

  const handleAssignDelivery = async (deliveryId: number) => {
    if (!selectedOrderId) return;
    try {
      await assignDelivery({
        orderId: selectedOrderId,
        deliveryId,
      }).unwrap();
      toast.success("Delivery assigned successfully");
      setIsAssignOpen(false);
      setSelectedOrderId(null);
    } catch {
      toast.error("Failed to assign delivery");
    }
  };

  // ==================== Filter ====================
  const handleFilterChange = (key: keyof OrderFilters, value: string | number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key !== "page") {
        (newFilters as OrderFilters).page = 1;
      } else {
        (newFilters as OrderFilters).page = value as number;
      }
      return newFilters;
    });
  };

  return {
    // Data
    orders: ordersData?.data?.orders ?? [],
    totalOrders: ordersData?.data?.totalOrders ?? 0,
    isLoading,
    isError,

    // User Role
    isAdmin,
    isEmployee,
    isMerchant,
    isDelivery,

    // Status Filter
    selectedStatus,
    setSelectedStatus,

    // Filters
    filters,
    handleFilterChange,

    // Delete
    isDeleteOpen,
    setIsDeleteOpen,
    selectedOrderId,
    setSelectedOrderId,
    handleDelete,
    isDeleting,

    // Change Status
    isStatusOpen,
    setIsStatusOpen,
    handleChangeStatus,
    isChangingStatus,

    // Assign Delivery
    isAssignOpen,
    setIsAssignOpen,
    handleAssignDelivery,
    isAssigning,

    // Navigation
    goToCreate: () => router.push(ROUTES.ORDER_CREATE),
    goToDetails: (id: number) => router.push(ROUTES.ORDER_DETAILS(id)),
  };
};
// useOrders.ts
// Handles all order operations based on user role

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetOrdersQuery,
  useGetMerchantOrdersQuery,
  useGetDeliveryOrdersQuery,
  useGetMerchantsQuery,
  useGetDeliveriesQuery,
  useDeleteOrderMutation,
  useChangeOrderStatusMutation,
  useAssignDeliveryMutation,
} from "@/store/slices/api/apiSlice";
import { useAppSelector } from "@/store/hooks";
import { ROLES } from "@/constants/roles";
import { ORDER_STATUSES } from "@/constants/orderStatuses";
import type { OrderFilters, OrdersResponse } from "@/types/order.types";
import { ROUTES } from "@/constants/routes";
import type { Delivery } from "@/types/delivery.types";
import type { Merchant } from "@/types/merchant.types";

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

  const { data: merchantsRes, isLoading: isLoadingMerchants } = useGetMerchantsQuery(
    { pageSize: 1000 },
    { skip: !isMerchant }
  );

  const merchants = useMemo<Merchant[]>(
    () => merchantsRes?.data?.merchants || [],
    [merchantsRes]
  );

  const currentMerchant = useMemo(
    () =>
      merchants.find(
        (merchant) =>
          merchant.email?.toLowerCase() === user?.email?.toLowerCase()
      ) ?? null,
    [merchants, user?.email]
  );

  const merchantId = currentMerchant?.id ?? 0;

  const { data: deliveriesRes, isLoading: isLoadingDeliveries } = useGetDeliveriesQuery(
    undefined,
    { skip: !isDelivery }
  );

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
    error: merchantOrdersError,
  } = useGetMerchantOrdersQuery(
    {
      merchantId,
      status: selectedStatus,
      filters,
    },
    { skip: !isMerchant || !merchantId }
  );

  const {
    data: deliveryOrdersData,
    isLoading: isLoadingDelivery,
    isError: isErrorDelivery,
    error: deliveryOrdersError,
  } = useGetDeliveryOrdersQuery(
    { deliveryId, status: selectedStatus, filters },
    { skip: !isDelivery || !deliveryId }
  );

  // ==================== Get correct data ====================
  const normalizedMerchantOrdersData = useMemo<OrdersResponse | undefined>(() => {
    if (merchantOrdersData) return merchantOrdersData;
    if (merchantOrdersError && typeof merchantOrdersError === "object" && "data" in merchantOrdersError) {
      return (merchantOrdersError as { data?: OrdersResponse }).data;
    }
    return undefined;
  }, [merchantOrdersData, merchantOrdersError]);

  const normalizedDeliveryOrdersData = useMemo<OrdersResponse | undefined>(() => {
    if (deliveryOrdersData) return deliveryOrdersData;
    if (deliveryOrdersError && typeof deliveryOrdersError === "object" && "data" in deliveryOrdersError) {
      return (deliveryOrdersError as { data?: OrdersResponse }).data;
    }
    return undefined;
  }, [deliveryOrdersData, deliveryOrdersError]);

  const ordersData = isMerchant
    ? normalizedMerchantOrdersData
    : isDelivery
    ? normalizedDeliveryOrdersData
    : allOrdersData;

  const isLoading =
    isLoadingAll ||
    isLoadingMerchant ||
    isLoadingDelivery ||
    isLoadingMerchants ||
    isLoadingDeliveries;
  const hasMerchantFallbackData = Boolean(normalizedMerchantOrdersData);
  const hasDeliveryFallbackData = Boolean(normalizedDeliveryOrdersData);
  const isError = isMerchant
    ? Boolean(!hasMerchantFallbackData && isErrorMerchant)
    : isDelivery
    ? Boolean(!hasDeliveryFallbackData && isErrorDelivery)
    : isErrorAll;

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
  const [assignedOrderIds, setAssignedOrderIds] = useState<Set<number>>(new Set());

  const handleAssignDelivery = async (deliveryId: number) => {
    if (!selectedOrderId) return;
    try {
      setAssignedOrderIds((prev) => new Set(prev).add(selectedOrderId));
      
      await assignDelivery({
        orderId: selectedOrderId,
        deliveryId,
      }).unwrap();
      
      toast.success("Delivery assigned successfully");
      setIsAssignOpen(false);
      setSelectedOrderId(null);
    } catch {
      setAssignedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(selectedOrderId);
        return next;
      });
      toast.error("Failed to assign delivery");
    }
  };

  const filteredOrders = useMemo(() => {
    const orders = ordersData?.data?.orders ?? [];
    if (selectedStatus === ORDER_STATUSES.PENDING) {
      return orders.filter((order) => !assignedOrderIds.has(order.id));
    }
    return orders;
  }, [ordersData, selectedStatus, assignedOrderIds]);

  const filteredTotalOrders = useMemo(() => {
    if (selectedStatus === ORDER_STATUSES.PENDING) {
      return Math.max(0, (ordersData?.data?.totalOrders ?? 0) - assignedOrderIds.size);
    }
    return ordersData?.data?.totalOrders ?? 0;
  }, [ordersData, selectedStatus, assignedOrderIds]);

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
    orders: filteredOrders,
    totalOrders: filteredTotalOrders,
    isLoading,
    isError,

    // User Role
    isAdmin,
    isEmployee,
    isMerchant,
    isDelivery,
    currentMerchant,
    currentDelivery,
    hasMerchantFallbackData,
    hasDeliveryFallbackData,

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
    goToDetails: (id: number, status?: string) =>
      router.push(
        status
          ? `${ROUTES.ORDER_DETAILS(id)}?status=${encodeURIComponent(status)}`
          : ROUTES.ORDER_DETAILS(id)
      ),
  };
};

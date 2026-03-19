// useDeliveries.ts
// Handles all delivery operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetDeliveriesQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
} from "@/store/slices/api/apiSlice";
import type { DeliveryCreateFormValues, DeliveryEditFormValues } from "@/features/deliveries/schema/delivery.schema";
import type { Delivery } from "@/types/delivery.types";
import { ROUTES } from "@/constants/routes";

export const useDeliveries = () => {
  const router = useRouter();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetDeliveriesQuery();

  // ==================== Create ====================
  const [createDelivery, { isLoading: isCreating }] = useCreateDeliveryMutation();

  const handleCreate = async (values: DeliveryCreateFormValues) => {
    try {
      await createDelivery(values).unwrap();
      toast.success("Delivery agent created successfully");
      router.push(ROUTES.DELIVERIES);
    } catch {
      toast.error("Failed to create delivery agent");
    }
  };

  // ==================== Update ====================
  const [updateDelivery, { isLoading: isUpdating }] = useUpdateDeliveryMutation();

  const handleUpdate = async (id: number, values: DeliveryEditFormValues) => {
    try {
      await updateDelivery({ id, data: values }).unwrap();
      toast.success("Delivery agent updated successfully");
      router.push(ROUTES.DELIVERIES);
    } catch {
      toast.error("Failed to update delivery agent");
    }
  };

  // ==================== Delete ====================
  const [deleteDelivery, { isLoading: isDeleting }] = useDeleteDeliveryMutation();

  const handleDelete = async () => {
    if (!selectedDelivery) return;
    try {
      await deleteDelivery(selectedDelivery.id).unwrap();
      toast.success("Delivery agent deleted successfully");
      setIsDeleteOpen(false);
      setSelectedDelivery(null);
    } catch {
      toast.error("Failed to delete delivery agent");
    }
  };

  // ==================== Helpers ====================
  const openDelete = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsDeleteOpen(true);
  };

  return {
    // Data (filter out soft-deleted items)
    deliveries: data?.filter((d) => !d.isDeleted) ?? [],
    isLoading,
    isError,

    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,
    selectedDelivery,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    openDelete,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};
// useShippingTypes.ts
// Handles all shipping type operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetShippingTypesQuery,
  useCreateShippingTypeMutation,
  useUpdateShippingTypeMutation,
  useDeleteShippingTypeMutation,
} from "@/store/slices/api/apiSlice";
import type { ShippingTypeFormValues } from "@/features/settings/shipping-types/schema/shippingType.schema";
import type { ShippingType } from "@/types/shippingType.types";

export const useShippingTypes = () => {
  const [selectedShippingType, setSelectedShippingType] = useState<ShippingType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetShippingTypesQuery();

  // ==================== Create ====================
  const [createShippingType, { isLoading: isCreating }] = useCreateShippingTypeMutation();

  const handleCreate = async (values: ShippingTypeFormValues) => {
    try {
      await createShippingType(values).unwrap();
      toast.success("Shipping type created successfully");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to create shipping type");
    }
  };

  // ==================== Update ====================
  const [updateShippingType, { isLoading: isUpdating }] = useUpdateShippingTypeMutation();

  const handleUpdate = async (values: ShippingTypeFormValues) => {
    if (!selectedShippingType) return;
    try {
      await updateShippingType({
        id: selectedShippingType.id,
        data: { ...values, id: selectedShippingType.id, isDeleted: false },
      }).unwrap();
      toast.success("Shipping type updated successfully");
      setIsFormOpen(false);
      setSelectedShippingType(null);
    } catch {
      toast.error("Failed to update shipping type");
    }
  };

  // ==================== Delete ====================
  const [deleteShippingType, { isLoading: isDeleting }] = useDeleteShippingTypeMutation();

  const handleDelete = async () => {
    if (!selectedShippingType) return;
    try {
      await deleteShippingType(selectedShippingType.id).unwrap();
      toast.success("Shipping type deleted successfully");
      setIsDeleteOpen(false);
      setSelectedShippingType(null);
    } catch {
      toast.error("Failed to delete shipping type");
    }
  };

  // ==================== Helpers ====================
  const openCreate = () => {
    setSelectedShippingType(null);
    setIsFormOpen(true);
  };

  const openEdit = (shippingType: ShippingType) => {
    setSelectedShippingType(shippingType);
    setIsFormOpen(true);
  };

  const openDelete = (shippingType: ShippingType) => {
    setSelectedShippingType(shippingType);
    setIsDeleteOpen(true);
  };

  return {
    // Data (filter out soft-deleted items)
    shippingTypes: data?.filter((st) => !st.isDeleted) ?? [],
    isLoading,
    isError,

    // Form
    isFormOpen,
    setIsFormOpen,
    selectedShippingType,

    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    openCreate,
    openEdit,
    openDelete,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,
  };
};
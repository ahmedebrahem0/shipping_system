// useGovernments.ts
// Handles all government operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetGovernmentsQuery,
  useCreateGovernmentMutation,
  useUpdateGovernmentMutation,
  useDeleteGovernmentMutation,
} from "@/store/slices/api/apiSlice";
import type { GovernmentFormValues } from "@/features/settings/governments/schema/government.schema";
import type { Government } from "@/types/government.types";

export const useGovernments = () => {
  const [page, setPage] = useState(1);
  const [selectedGovernment, setSelectedGovernment] = useState<Government | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetGovernmentsQuery({ page, pageSize: 10 });

  // ==================== Create ====================
  const [createGovernment, { isLoading: isCreating }] = useCreateGovernmentMutation();

  const handleCreate = async (values: GovernmentFormValues) => {
    try {
      await createGovernment(values).unwrap();
      toast.success("Government created successfully");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to create government");
    }
  };

  // ==================== Update ====================
  const [updateGovernment, { isLoading: isUpdating }] = useUpdateGovernmentMutation();

  const handleUpdate = async (values: GovernmentFormValues) => {
    if (!selectedGovernment) return;
    try {
      await updateGovernment({
        id: selectedGovernment.id,
        data: { ...values, isDeleted: false },
      }).unwrap();
      toast.success("Government updated successfully");
      setIsFormOpen(false);
      setSelectedGovernment(null);
    } catch {
      toast.error("Failed to update government");
    }
  };

  // ==================== Delete ====================
  const [deleteGovernment, { isLoading: isDeleting }] = useDeleteGovernmentMutation();

  const handleDelete = async () => {
    if (!selectedGovernment) return;
    try {
      await deleteGovernment(selectedGovernment.id).unwrap();
      toast.success("Government deleted successfully");
      setIsDeleteOpen(false);
      setSelectedGovernment(null);
    } catch {
      toast.error("Failed to delete government");
    }
  };

  // ==================== Helpers ====================
  const openCreate = () => {
    setSelectedGovernment(null);
    setIsFormOpen(true);
  };

  const openEdit = (government: Government) => {
    setSelectedGovernment(government);
    setIsFormOpen(true);
  };

  const openDelete = (government: Government) => {
    setSelectedGovernment(government);
    setIsDeleteOpen(true);
  };

  return {
    // Data (filter out soft-deleted items)
    governments: data?.governments?.filter((g) => !g.isDeleted) ?? [],
    totalGovernments: data?.totalGovernments ?? 0,
    page,
    isLoading,
    isError,

    // Pagination
    setPage,

    // Form
    isFormOpen,
    setIsFormOpen,
    selectedGovernment,

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
// useMerchants.ts
// Handles all merchant operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetMerchantsQuery,
  useCreateMerchantMutation,
  useUpdateMerchantMutation,
  useDeleteMerchantMutation,
} from "@/store/slices/api/apiSlice";
import type { MerchantCreateFormValues, MerchantEditFormValues } from "@/features/merchants/schema/merchant.schema";
import type { Merchant } from "@/types/merchant.types";
import { ROUTES } from "@/constants/routes";

export const useMerchants = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTxt, setSearchTxt] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetMerchantsQuery({
    page,
    pageSize: 10,

  });

  // ==================== Create ====================
  const [createMerchant, { isLoading: isCreating }] = useCreateMerchantMutation();

  const handleCreate = async (values: MerchantCreateFormValues) => {
    try {
      await createMerchant(values).unwrap();
      toast.success("Merchant created successfully");
      router.push(ROUTES.MERCHANTS);
    } catch {
      toast.error("Failed to create merchant");
    }
  };

  // ==================== Update ====================
  const [updateMerchant, { isLoading: isUpdating }] = useUpdateMerchantMutation();

  const handleUpdate = async (id: number, values: MerchantEditFormValues) => {
    try {
      const data = {
        ...values,
        branches_Id: values.branches_Id ? [values.branches_Id].flat() : [],
      };
      await updateMerchant({ id, data }).unwrap();
      toast.success("Merchant updated successfully");
      router.push(ROUTES.MERCHANTS);
    } catch {
      toast.error("Failed to update merchant");
    }
  };

  // ==================== Delete ====================
  const [deleteMerchant, { isLoading: isDeleting }] = useDeleteMerchantMutation();

  const handleDelete = async () => {
    if (!selectedMerchant) return;
    try {
      await deleteMerchant(selectedMerchant.id).unwrap();
      toast.success("Merchant deleted successfully");
      setIsDeleteOpen(false);
      setSelectedMerchant(null);
    } catch {
      toast.error("Failed to delete merchant");
    }
  };

  // ==================== Helpers ====================
  const openDelete = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsDeleteOpen(true);
  };

  return {
    // Data
    merchants: data?.data?.merchants ?? [],
    totalMerchants: data?.data?.totalMerchants ?? 0,
    page,
    isLoading,
    isError,

    // Search & Pagination

    setPage,

    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,
    selectedMerchant,

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
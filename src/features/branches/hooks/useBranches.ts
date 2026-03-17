// useBranches.ts
// Handles all branch operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "@/store/slices/api/apiSlice";
import type { BranchFormValues } from "@/features/branches/schema/branch.schema";
import type { Branch } from "@/types/branch.types";

export const useBranches = () => {
  const [page, setPage] = useState(1);
  const [searchTxt, setSearchTxt] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetBranchesQuery({
    page,
    pageSize: 10,
    
  });

  // ==================== Create ====================
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();

  const handleCreate = async (values: BranchFormValues) => {
    try {
      await createBranch(values).unwrap();
      toast.success("Branch created successfully");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to create branch");
    }
  };

  // ==================== Update ====================
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  const handleUpdate = async (values: BranchFormValues) => {
    if (!selectedBranch) return;
    try {
      await updateBranch({
        id: selectedBranch.id,
        data: { ...values, isDeleted: false },
      }).unwrap();
      toast.success("Branch updated successfully");
      setIsFormOpen(false);
      setSelectedBranch(null);
    } catch {
      toast.error("Failed to update branch");
    }
  };

  // ==================== Delete ====================
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const handleDelete = async () => {
    if (!selectedBranch) return;
    try {
      await deleteBranch(selectedBranch.id).unwrap();
      toast.success("Branch deleted successfully");
      setIsDeleteOpen(false);
      setSelectedBranch(null);
    } catch {
      toast.error("Failed to delete branch");
    }
  };

  // ==================== Helpers ====================
  const openCreate = () => {
    setSelectedBranch(null);
    setIsFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsFormOpen(true);
  };

  const openDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteOpen(true);
  };

  return {
    // Data
    branches: data?.data?.branches ?? [],
    totalBranches: data?.data?.totalBranches ?? 0,
    page,
    isLoading,
    isError,

    // Search & Pagination
    searchTxt,
    setSearchTxt,
    setPage,

    // Form
    isFormOpen,
    setIsFormOpen,
    selectedBranch,

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
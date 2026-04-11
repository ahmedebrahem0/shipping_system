// BranchForm.tsx
// Form for creating and editing a branch

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchSchema, type BranchFormValues } from "@/features/branches/schema/branch.schema";
import type { Branch } from "@/types/branch.types";

interface BranchFormProps {
  selectedBranch: Branch | null;
  isLoading: boolean;
  onSubmit: (values: BranchFormValues) => void;
  onCancel: () => void;
}

export default function BranchForm({
  selectedBranch,
  isLoading,
  onSubmit,
  onCancel,
}: BranchFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: yupResolver(branchSchema),
  });

  // لو editing بنملي الـ form ببيانات الـ branch
  useEffect(() => {
    if (selectedBranch) {
      reset({
        name: selectedBranch.name,
        mobile: selectedBranch.mobile,
        location: selectedBranch.location,
      });
    } else {
      reset({ name: "", mobile: "", location: "" });
    }
  }, [selectedBranch, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Branch Name</label>
        <input
          {...register("name")}
          placeholder="Enter branch name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Mobile */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Mobile</label>
        <input
          {...register("mobile")}
          placeholder="01XXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.mobile && (
          <p className="text-xs text-red-500">{errors.mobile.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <input
          {...register("location")}
          placeholder="Enter branch location"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.location && (
          <p className="text-xs text-red-500">{errors.location.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : selectedBranch ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
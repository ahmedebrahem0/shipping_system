// GovernmentForm.tsx
// Form for creating and editing a government

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { governmentSchema, type GovernmentFormValues } from "@/features/settings/governments/schema/government.schema";
import { useGetBranchesQuery } from "@/store/slices/api/apiSlice";
import type { Government } from "@/types/government.types";

interface GovernmentFormProps {
  selectedGovernment: Government | null;
  isLoading: boolean;
  onSubmit: (values: GovernmentFormValues) => void;
  onCancel: () => void;
}

export default function GovernmentForm({
  selectedGovernment,
  isLoading,
  onSubmit,
  onCancel,
}: GovernmentFormProps) {
  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GovernmentFormValues>({
    resolver: yupResolver(governmentSchema),
  });

  useEffect(() => {
    if (selectedGovernment) {
      reset({
        name: selectedGovernment.name,
        branch_Id: selectedGovernment.branch_Id,
      });
    } else {
      reset({ name: "", branch_Id: 0 });
    }
  }, [selectedGovernment, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Government Name</label>
        <input
          {...register("name")}
          placeholder="Enter government name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Branch - Only show active branches */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Branch</label>
        <select
          {...register("branch_Id")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
        >
          <option value={0}>Select a branch</option>
          {branchesData?.data?.branches
            ?.filter((branch) => !branch.isDeleted)
            .map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
        </select>
        {errors.branch_Id && (
          <p className="text-xs text-red-500">{errors.branch_Id.message}</p>
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
          {isLoading ? "Saving..." : selectedGovernment ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
// MerchantForm.tsx
// Form for creating and editing a merchant

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  merchantCreateSchema,
  merchantEditSchema,
  type MerchantCreateFormValues,
  type MerchantEditFormValues,
} from "@/features/merchants/schema/merchant.schema";
import { useGetBranchesQuery, useGetGovernmentsQuery } from "@/store/slices/api/apiSlice";
import type { Merchant } from "@/types/merchant.types";

interface MerchantFormProps {
  selectedMerchant?: Merchant | null;
  isLoading: boolean;
  onSubmit: (values: MerchantCreateFormValues | MerchantEditFormValues) => void;
  onCancel: () => void;
}

export default function MerchantForm({
  selectedMerchant,
  isLoading,
  onSubmit,
  onCancel,
}: MerchantFormProps) {
  const isEditing = !!selectedMerchant;

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MerchantCreateFormValues | MerchantEditFormValues>({
    resolver: yupResolver(
      isEditing ? merchantEditSchema : merchantCreateSchema
    ) as never,
  });

  useEffect(() => {
    if (selectedMerchant) {
      reset({
        name: selectedMerchant.name,
        email: selectedMerchant.email,
        phone: selectedMerchant.phone,
        address: selectedMerchant.address,
        storeName: selectedMerchant.storeName,
        government: selectedMerchant.government,
        city: selectedMerchant.city,
        pickupCost: selectedMerchant.pickupCost,
        rejectedOrderPercentage: selectedMerchant.rejectedOrderPercentage,
      });
    } else {
      reset({});
    }
  }, [selectedMerchant, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("name")}
          placeholder="Enter merchant name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password - Create only */}
      {!isEditing && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password" as never)}
              type="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {(errors as never as { password?: { message: string } }).password && (
              <p className="text-xs text-red-500">
                {(errors as never as { password?: { message: string } }).password?.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register("confirmPassword" as never)}
              type="password"
              placeholder="Confirm password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
            />
            {(errors as never as { confirmPassword?: { message: string } }).confirmPassword && (
              <p className="text-xs text-red-500">
                {(errors as never as { confirmPassword?: { message: string } }).confirmPassword?.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          {...register("address")}
          placeholder="Enter address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      {/* Store Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Store Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("storeName")}
          placeholder="Enter store name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
      </div>

      {/* Government */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Government</label>
        <select
          {...register("government")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
        >
          <option value="">Select a government</option>
          {governmentsData?.governments?.map((gov) => (
            <option key={gov.id} value={gov.name}>
              {gov.name}
            </option>
          ))}
        </select>
        {errors.government && <p className="text-xs text-red-500">{errors.government.message}</p>}
      </div>

      {/* City */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">City</label>
        <input
          {...register("city")}
          placeholder="Enter city"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
      </div>

      {/* Pickup Cost */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Pickup Cost</label>
        <input
          {...register("pickupCost")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.pickupCost && <p className="text-xs text-red-500">{errors.pickupCost.message}</p>}
      </div>

      {/* Rejected Order Percentage */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Rejected Order Percentage <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("rejectedOrderPercentage")}
          type="number"
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
      </div>

      {/* Branch */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Branch</label>
        <select
          {...register("branches_Id" as never)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
        >
          <option value="">Select a branch</option>
          {branchesData?.data?.branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
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
          className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
// DeliveryForm.tsx
// Form for creating and editing a delivery agent

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  deliveryCreateSchema,
  deliveryEditSchema,
  type DeliveryCreateFormValues,
  type DeliveryEditFormValues,
} from "@/features/deliveries/schema/delivery.schema";
import { useGetBranchesQuery, useGetGovernmentsQuery } from "@/store/slices/api/apiSlice";
import PasswordInput from "@/components/common/PasswordInput";
import { DISCOUNT_TYPES } from "@/constants/shippingTypes";

import type { Delivery } from "@/types/delivery.types";

interface DeliveryFormProps {
  selectedDelivery?: Delivery | null;
  isLoading: boolean;
  onSubmit: (values: DeliveryCreateFormValues | DeliveryEditFormValues) => void;
  onCancel: () => void;
}

export default function DeliveryForm({
  selectedDelivery,
  isLoading,
  onSubmit,
  onCancel,
}: DeliveryFormProps) {
  const isEditing = !!selectedDelivery;

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryCreateFormValues | DeliveryEditFormValues>({
    resolver: yupResolver(
      isEditing ? deliveryEditSchema : deliveryCreateSchema
    ) as never,
  });

  useEffect(() => {
    if (selectedDelivery) {
      reset({
        name: selectedDelivery.name,
        email: selectedDelivery.email,
        phone: selectedDelivery.phone,
        password: "",
        address: selectedDelivery.address,
        branchId: 0,
        governmentsId: [],
        discountType: selectedDelivery.discountType,
        companyPercentage: selectedDelivery.companyPercentage,
        isDeleted: selectedDelivery.isDeleted,
      });
    } else {
      reset({});
    }
  }, [selectedDelivery, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("name")}
          placeholder="Enter agent name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <PasswordInput
          {...register("password")}
          placeholder="Enter password"
          error={errors.password?.message}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          {...register("address")}
          placeholder="Enter address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      {/* Branch */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Branch</label>
        <select
          {...register("branchId")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
        >
          <option value={0}>Select a branch</option>
          {branchesData?.data?.branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        {errors.branchId && <p className="text-xs text-red-500">{errors.branchId.message}</p>}
      </div>

      {/* Governments - Multi Select */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Governments</label>
        <select
          {...register("governmentsId")}
          multiple
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white h-32"
        >
          {governmentsData?.governments?.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400">Hold Ctrl to select multiple</p>
        {errors.governmentsId && <p className="text-xs text-red-500">{errors.governmentsId.message}</p>}
      </div>

      {/* Discount Type */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Discount Type</label>
        <select
          {...register("discountType")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
        >
          <option value="">Select discount type</option>
          {Object.values(DISCOUNT_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.discountType && <p className="text-xs text-red-500">{errors.discountType.message}</p>}
      </div>

      {/* Company Percentage */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Company Percentage</label>
        <input
          {...register("companyPercentage")}
          type="number"
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.companyPercentage && <p className="text-xs text-red-500">{errors.companyPercentage.message}</p>}
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
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
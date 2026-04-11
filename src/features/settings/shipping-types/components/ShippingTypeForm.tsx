// ShippingTypeForm.tsx
// Form for creating and editing a shipping type

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  shippingTypeSchema,
  type ShippingTypeFormValues,
} from "@/features/settings/shipping-types/schema/shippingType.schema";
import type { ShippingType } from "@/types/shippingType.types";

interface ShippingTypeFormProps {
  selectedShippingType: ShippingType | null;
  isLoading: boolean;
  onSubmit: (values: ShippingTypeFormValues) => void;
  onCancel: () => void;
}

export default function ShippingTypeForm({
  selectedShippingType,
  isLoading,
  onSubmit,
  onCancel,
}: ShippingTypeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingTypeFormValues>({
    resolver: yupResolver(shippingTypeSchema),
  });

  useEffect(() => {
    if (selectedShippingType) {
      reset({
        type: selectedShippingType.type,
        description: selectedShippingType.description,
        cost: selectedShippingType.cost,
      });
    } else {
      reset({ type: "", description: "", cost: 0 });
    }
  }, [selectedShippingType, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Type */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Type</label>
        <input
          {...register("type")}
          placeholder="e.g. Express, Standard"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 resize-none"
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      {/* Cost */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Cost (EGP)</label>
        <input
          {...register("cost")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.cost && <p className="text-xs text-red-500">{errors.cost.message}</p>}
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
          {isLoading ? "Saving..." : selectedShippingType ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
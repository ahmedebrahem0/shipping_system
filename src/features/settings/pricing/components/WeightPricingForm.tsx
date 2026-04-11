// WeightPricingForm.tsx
// Form for creating and updating weight pricing settings

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  weightPricingSchema,
  type WeightPricingFormValues,
} from "@/features/settings/pricing/schema/weightPricing.schema";
import { useWeightPricing } from "@/features/settings/pricing/hooks/useWeightPricing";

export default function WeightPricingForm() {
  const { handleSubmit, isLoading, isExisting } = useWeightPricing();

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<WeightPricingFormValues>({
    resolver: yupResolver(weightPricingSchema),
  });

  return (
    <form onSubmit={onSubmit(handleSubmit)} className="space-y-4">

      {/* Default Weight */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Default Weight (kg)
        </label>
        <input
          {...register("defaultWeight")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.defaultWeight && (
          <p className="text-xs text-red-500">{errors.defaultWeight.message}</p>
        )}
      </div>

      {/* Additional Kg Price */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Additional KG Price (EGP)
        </label>
        <input
          {...register("additionalKgPrice")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.additionalKgPrice && (
          <p className="text-xs text-red-500">{errors.additionalKgPrice.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Saving..." : isExisting ? "Update Pricing" : "Save Pricing"}
      </button>

    </form>
  );
}
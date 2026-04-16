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
    <form onSubmit={onSubmit(handleSubmit)} className="space-y-6">
      {/* Default Weight */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Default Weight (kg)
        </label>
        <div className="relative">
          <input
            {...register("defaultWeight")}
            type="number"
            placeholder="0.00"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
        {errors.defaultWeight && (
          <p className="text-xs font-medium text-red-500">
            {errors.defaultWeight.message}
          </p>
        )}
      </div>

      {/* Additional Kg Price */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Additional KG Price (EGP)
        </label>
        <div className="relative">
          <input
            {...register("additionalKgPrice")}
            type="number"
            placeholder="0.00"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          />
        </div>
        {errors.additionalKgPrice && (
          <p className="text-xs font-medium text-red-500">
            {errors.additionalKgPrice.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Saving..."
          : isExisting
          ? "Update Pricing"
          : "Save Pricing"}
      </button>
    </form>
  );
}
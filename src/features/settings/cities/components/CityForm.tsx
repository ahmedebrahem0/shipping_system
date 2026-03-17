// CityForm.tsx
// Form for creating and editing a city

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { citySchema, type CityFormValues } from "@/features/settings/cities/schema/city.schema";
import { useGetGovernmentsQuery } from "@/store/slices/api/apiSlice";
import type { City } from "@/types/city.types";

interface CityFormProps {
  selectedCity: City | null;
  isLoading: boolean;
  onSubmit: (values: CityFormValues) => void;
  onCancel: () => void;
}

export default function CityForm({
  selectedCity,
  isLoading,
  onSubmit,
  onCancel,
}: CityFormProps) {
  const { data: governmentsData } = useGetGovernmentsQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CityFormValues>({
    resolver: yupResolver(citySchema),
  });

  useEffect(() => {
    if (selectedCity) {
      reset({
        name: selectedCity.name,
        government_Id: 0,
        pickupShipping: selectedCity.pickupShipping ?? undefined,
        standardShipping: selectedCity.standardShipping,
      });
    } else {
      reset({
        name: "",
        government_Id: 0,
        pickupShipping: undefined,
        standardShipping: undefined,
      });
    }
  }, [selectedCity, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">City Name</label>
        <input
          {...register("name")}
          placeholder="Enter city name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Government */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Government</label>
        <select
          {...register("government_Id")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500 bg-white"
        >
          <option value={0}>Select a government</option>
          {governmentsData?.governments?.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>
        {errors.government_Id && (
          <p className="text-xs text-red-500">{errors.government_Id.message}</p>
        )}
      </div>

      {/* Pickup Shipping */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Pickup Shipping <span className="text-gray-400">(optional)</span>
        </label>
        <input
          {...register("pickupShipping")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.pickupShipping && (
          <p className="text-xs text-red-500">{errors.pickupShipping.message}</p>
        )}
      </div>

      {/* Standard Shipping */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Standard Shipping</label>
        <input
          {...register("standardShipping")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.standardShipping && (
          <p className="text-xs text-red-500">{errors.standardShipping.message}</p>
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
          className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : selectedCity ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
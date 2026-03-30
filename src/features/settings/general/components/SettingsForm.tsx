// SettingsForm.tsx
// Form for managing general settings

"use client";

import { useSettings } from "@/features/settings/general/hooks/useSettings";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function SettingsForm() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    isError,
    isExisting,
    isSaving,
  } = useSettings();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Shipping To Village Cost */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Shipping To Village Cost (EGP)
        </label>
        <input
          {...register("shippingToVillageCost")}
          type="number"
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-500"
        />
        {errors.shippingToVillageCost && (
          <p className="text-xs text-red-500">{errors.shippingToVillageCost.message}</p>
        )}
      </div>

      {/* Delivery Auto Accept */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-700">Delivery Auto Accept</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Automatically accept delivery orders without manual approval
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            {...register("deliveryAutoAccept")}
            type="checkbox"
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? "Saving..." : isExisting ? "Update Settings" : "Save Settings"}
      </button>

    </form>
  );
}
// useWeightPricing.ts
// Handles weight pricing operations - create and update

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateWeightPricingMutation,
  useUpdateWeightPricingMutation,
} from "@/store/slices/api/apiSlice";
import type { WeightPricingFormValues } from "@/features/settings/pricing/schema/weightPricing.schema";

export const useWeightPricing = () => {
  const [isExisting, setIsExisting] = useState(false);

  // ==================== Create ====================
  const [createWeightPricing, { isLoading: isCreating }] = useCreateWeightPricingMutation();

  // ==================== Update ====================
  const [updateWeightPricing, { isLoading: isUpdating }] = useUpdateWeightPricingMutation();

  const handleSubmit = async (values: WeightPricingFormValues) => {
    try {
      if (isExisting) {
        await updateWeightPricing(values).unwrap();
        toast.success("Weight pricing updated successfully");
      } else {
        await createWeightPricing(values).unwrap();
        toast.success("Weight pricing created successfully");
        setIsExisting(true);
      }
    } catch {
      toast.error("Failed to save weight pricing");
    }
  };

  return {
    isExisting,
    setIsExisting,
    handleSubmit,
    isLoading: isCreating || isUpdating,
  };
};
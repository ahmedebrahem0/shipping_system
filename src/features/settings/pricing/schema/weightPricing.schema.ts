// weightPricing.schema.ts
// Validation rules for weight pricing form

import * as yup from "yup";

export const weightPricingSchema = yup.object({
  defaultWeight: yup
    .number()
    .min(0, "Default weight must be a positive number")
    .required("Default weight is required"),

  additionalKgPrice: yup
    .number()
    .min(0, "Additional kg price must be a positive number")
    .required("Additional kg price is required"),
});

export type WeightPricingFormValues = yup.InferType<typeof weightPricingSchema>;
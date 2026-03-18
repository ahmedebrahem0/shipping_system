// shippingType.schema.ts
// Validation rules for shipping type create and edit forms

import * as yup from "yup";

export const shippingTypeSchema = yup.object({
  type: yup
    .string()
    .min(2, "Type must be at least 2 characters")
    .required("Type is required"),

  description: yup
    .string()
    .max(150, "Description must be at most 150 characters")
    .optional(),

  cost: yup
    .number()
    .min(0, "Cost must be a positive number")
    .required("Cost is required"),
});

export type ShippingTypeFormValues = yup.InferType<typeof shippingTypeSchema>;
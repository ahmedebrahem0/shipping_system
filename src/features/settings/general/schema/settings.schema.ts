// settings.schema.ts
// Validation rules for general settings form

import * as yup from "yup";

export const settingsSchema = yup.object({
  shippingToVillageCost: yup
    .number()
    .min(0, "Cost must be a positive number")
    .required("Shipping to village cost is required"),

  deliveryAutoAccept: yup
    .boolean()
    .required("Delivery auto accept is required"),
});

export type SettingsFormValues = yup.InferType<typeof settingsSchema>;
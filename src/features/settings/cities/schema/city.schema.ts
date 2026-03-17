// city.schema.ts
// Validation rules for city create and edit forms

import * as yup from "yup";

export const citySchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  government_Id: yup
    .number()
    .min(1, "Please select a government")
    .required("Government is required"),

  pickupShipping: yup
    .number()
    .min(0, "Pickup shipping must be a positive number")
    .nullable()
    .optional(),

  standardShipping: yup
    .number()
    .min(0, "Standard shipping must be a positive number")
    .optional(),
});

export type CityFormValues = yup.InferType<typeof citySchema>;
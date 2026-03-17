// government.schema.ts
// Validation rules for government create and edit forms

import * as yup from "yup";

export const governmentSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  branch_Id: yup
    .number()
    .min(1, "Please select a branch")
    .required("Branch is required"),
});

export type GovernmentFormValues = yup.InferType<typeof governmentSchema>;
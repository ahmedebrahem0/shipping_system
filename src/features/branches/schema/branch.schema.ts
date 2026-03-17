// branch.schema.ts
// Validation rules for branch create and edit forms

import * as yup from "yup";

export const branchSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  mobile: yup
    .string()
    .matches(
      /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/,
      "Please enter a valid Egyptian phone number"
    )
    .required("Mobile is required"),

  location: yup
    .string()
    .min(3, "Location must be at least 3 characters")
    .required("Location is required"),
});

export type BranchFormValues = yup.InferType<typeof branchSchema>;
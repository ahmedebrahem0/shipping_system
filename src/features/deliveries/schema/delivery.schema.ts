// delivery.schema.ts
// Validation rules for delivery create and edit forms

import * as yup from "yup";

const egyptianPhoneRegex = /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/;

export const deliveryCreateSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must be at most 10 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  address: yup
    .string()
    .min(3, "Address must be at least 3 characters")
    .required("Address is required"),

  branchId: yup
    .number()
    .min(1, "Please select a branch")
    .required("Branch is required"),

  governmentsId: yup
    .array()
    .of(yup.number().required())
    .min(1, "Please select at least one government")
    .required("Government is required"),

  discountType: yup
    .string()
    .required("Discount type is required"),

  companyPercentage: yup
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Company percentage is required"),
});

export const deliveryEditSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(10, "Name must be at most 10 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  address: yup
    .string()
    .min(3, "Address must be at least 3 characters")
    .required("Address is required"),

  branchId: yup
    .number()
    .min(1, "Please select a branch")
    .required("Branch is required"),

  governmentsId: yup
    .array()
    .of(yup.number().required())
    .min(1, "Please select at least one government")
    .required("Government is required"),

  discountType: yup
    .string()
    .required("Discount type is required"),

  companyPercentage: yup
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .required("Company percentage is required"),

  isDeleted: yup.boolean().default(false),
});

export type DeliveryCreateFormValues = yup.InferType<typeof deliveryCreateSchema>;
export type DeliveryEditFormValues = yup.InferType<typeof deliveryEditSchema>;
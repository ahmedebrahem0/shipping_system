// merchant.schema.ts
// Validation rules for merchant create and edit forms

import * as yup from "yup";

const egyptianPhoneRegex = /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const merchantCreateSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(passwordRegex, "Password must contain uppercase, lowercase and number")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),

  phone: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  address: yup
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address must be at most 100 characters")
    .required("Address is required"),

  storeName: yup
    .string()
    .max(100, "Store name must be at most 100 characters")
    .optional(),

  government: yup
    .string()
    .required("Government is required"),

  city: yup
    .string()
    .required("City is required"),

  pickupCost: yup
    .number()
    .min(1, "Pickup cost must be at least 1")
    .required("Pickup cost is required"),

  rejectedOrderPercentage: yup
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .optional(),
});

export const merchantEditSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(egyptianPhoneRegex, "Please enter a valid Egyptian phone number")
    .required("Phone is required"),

  address: yup
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(100, "Address must be at most 100 characters")
    .required("Address is required"),

  storeName: yup
    .string()
    .max(100)
    .optional(),

  government: yup
    .string()
    .required("Government is required"),

  city: yup
    .string()
    .required("City is required"),

  pickupCost: yup
    .number()
    .min(1, "Pickup cost must be at least 1")
    .required("Pickup cost is required"),

  rejectedOrderPercentage: yup
    .number()
    .min(0)
    .max(100)
    .optional(),

  branches_Id: yup
    .array()
    .of(yup.number())
    .optional(),

  currentPassword: yup.string().optional(),
  newPassword: yup
    .string()
    .min(6)
    .matches(passwordRegex, "Password must contain uppercase, lowercase and number")
    .optional(),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .optional(),
});

export type MerchantCreateFormValues = yup.InferType<typeof merchantCreateSchema>;
export type MerchantEditFormValues = yup.InferType<typeof merchantEditSchema>;
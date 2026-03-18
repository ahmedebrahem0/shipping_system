// employee.schema.ts
// Validation rules for employee create and edit forms

import * as yup from "yup";

const egyptianPhoneRegex = /^(?:\+20|0)?1[0-2,5]{1}[0-9]{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const employeeCreateSchema = yup.object({
name: yup
  .string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters")
  .matches(/^\S+$/, "Name cannot contain spaces")
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

  role: yup
    .string()
    .required("Role is required"),

  branchId: yup
    .number()
    .min(1, "Please select a branch")
    .optional(),
});

export const employeeEditSchema = yup.object({
name: yup
  .string()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters")
  .matches(/^\S+$/, "Name cannot contain spaces")
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

  role: yup
    .string()
    .required("Role is required"),

  branchId: yup
    .number()
    .min(1, "Please select a branch")
    .optional(),
});

export type EmployeeCreateFormValues = yup.InferType<typeof employeeCreateSchema>;
export type EmployeeEditFormValues = yup.InferType<typeof employeeEditSchema>;
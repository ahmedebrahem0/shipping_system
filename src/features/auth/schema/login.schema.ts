// login.schema.ts
// Validation rules for the login form using Yup

import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// بنستخدمه عشان نعرف التايب بتاع الـ form
export type LoginFormValues = yup.InferType<typeof loginSchema>;
// = { email: string, password: string }

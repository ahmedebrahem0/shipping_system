// forgot-password.schema.ts
// Validation rules for the forgot password form using Yup

import * as yup from "yup";

export const forgotPasswordSchema = yup.object({ 
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;

import * as yup from "yup";

export const verifyOTPSchema = yup.object({
  email: yup.string().required("Email is required"),
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

export type VerifyOTPFormValues = yup.InferType<typeof verifyOTPSchema>;

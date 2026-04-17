"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/features/auth/schema/forgot-password.schema";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const { handleForgotPassword, isLoading } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    handleForgotPassword(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-primary-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we&apos;ll send you an OTP to reset your password
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
        <input
          id="email"
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-500 mt-1" role="alert">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Send OTP"
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

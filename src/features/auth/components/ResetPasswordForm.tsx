"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/features/auth/schema/reset-password.schema";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const email = sessionStorage.getItem("resetEmail") || "";
  const otp = sessionStorage.getItem("resetOTP") || "";
  const { handleResetPassword, isLoading } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { email, otp, newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (!email || !otp) {
      window.location.href = "/forgot-password";
    }
  }, [email, otp]);

  const newPassword = watch("newPassword", "");

  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "One number", met: /[0-9]/.test(newPassword) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const onSubmit = (data: ResetPasswordFormValues) => {
    handleResetPassword(data.email, data.otp, data.newPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Create a new password for your account
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">New Password</label>
        <div className="relative">
          <input
            {...register("newPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 space-y-1">
        <p className="text-xs font-medium text-gray-600 mb-2">Password must contain:</p>
        {passwordRequirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <X className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span className={req.met ? "text-green-600" : "text-gray-500"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
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
            Resetting...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="text-primary-500 font-semibold hover:underline">
          Sign in
        </Link>
      </p>

      <div hidden>
        <input {...register("email")} />
        <input {...register("otp")} />
      </div>
    </form>
  );
}

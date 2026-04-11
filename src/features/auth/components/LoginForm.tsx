// LoginForm.tsx
// Login form component with validation using React Hook Form and Yup

"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema/login.schema";
import { useLogin } from "@/features/auth/hooks/useLogin";
import DemoRoleButtons from "@/features/auth/components/DemoRoleButtons";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { handleLogin, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    handleLogin(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Demo Role Buttons */}
      <DemoRoleButtons setValue={setValue} />

      <hr className="border-gray-200" />

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
     {/* Password */}
<div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">
    Password
  </label>

  <div className="relative">
    <input
      {...register("password")}
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
    />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>

  {errors.password && (
    <p className="text-xs text-red-500">{errors.password.message}</p>
  )}
</div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

    </form>
  );
}
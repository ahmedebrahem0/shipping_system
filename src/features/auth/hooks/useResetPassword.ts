"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/store/slices/api/apiSlice";
import { ROUTES } from "@/constants/routes";

export const useResetPassword = () => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleResetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await resetPassword({ email, otp, newPassword }).unwrap();
      toast.success("Password reset successfully!");
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetOTP");
      router.push(ROUTES.LOGIN);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return { handleResetPassword, isLoading };
};

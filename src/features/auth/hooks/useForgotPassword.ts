"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/store/slices/api/apiSlice";
import { ROUTES } from "@/constants/routes";

export const useForgotPassword = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("OTP sent to your email!");
      sessionStorage.setItem("resetEmail", email);
      router.push(ROUTES.VERIFY_OTP);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  return { handleForgotPassword, isLoading };
};

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useVerifyOTPMutation, useForgotPasswordMutation } from "@/store/slices/api/apiSlice";
import { ROUTES } from "@/constants/routes";

export const useVerifyOTP = () => {
  const router = useRouter();
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP] = useForgotPasswordMutation();

  const handleVerifyOTP = async (email: string, otp: string) => {
    try {
      const response = await verifyOTP({ email, otp }).unwrap();
      
      if (response.isValid) {
        toast.success("OTP verified successfully!");
        sessionStorage.setItem("resetOTP", otp);
        router.push(ROUTES.RESET_PASSWORD);
      } else {
        toast.error(response.message || "Invalid OTP");
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResendOTP = async (email: string) => {
    try {
      await resendOTP({ email }).unwrap();
      toast.success("New OTP sent to your email!");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  return { handleVerifyOTP, handleResendOTP, isLoading };
};

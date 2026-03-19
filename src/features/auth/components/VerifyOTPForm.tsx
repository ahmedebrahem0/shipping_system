"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyOTPSchema, type VerifyOTPFormValues } from "@/features/auth/schema/verify-otp.schema";
import { useVerifyOTP } from "@/features/auth/hooks/useVerifyOTP";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const RESEND_COOLDOWN = 60;

export default function VerifyOTPForm() {
  const email = sessionStorage.getItem("resetEmail") || "";
  const { handleVerifyOTP, handleResendOTP, isLoading } = useVerifyOTP();
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOTPFormValues>({
    resolver: yupResolver(verifyOTPSchema),
    defaultValues: { email, otp: "" },
  });

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setValue("otp", otpDigits.join(""));
  }, [otpDigits, setValue]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newDigits = [...otpDigits];
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, i) => {
        if (i < 6) newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newDigits[index] = value;
      setOtpDigits(newDigits);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.split("");
    const newDigits = [...otpDigits];
    digits.forEach((digit, i) => {
      if (i < 6) newDigits[i] = digit;
    });
    setOtpDigits(newDigits);
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const onSubmit = (data: VerifyOTPFormValues) => {
    handleVerifyOTP(data.email, data.otp);
  };

  const onResend = () => {
    setTimer(RESEND_COOLDOWN);
    setCanResend(false);
    setOtpDigits(["", "", "", "", "", ""]);
    handleResendOTP(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the 6-digit code sent to<br />
          <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            style={{ caretColor: "transparent" }}
          />
        ))}
      </div>
      {errors.otp && (
        <p className="text-center text-xs text-red-500">{errors.otp.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || otpDigits.join("").length !== 6}
        className="w-full py-3 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying...
          </span>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="text-center">
        {canResend ? (
          <button
            type="button"
            onClick={onResend}
            className="text-sm text-orange-500 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-medium text-gray-700">{formatTime(timer)}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/login" className="text-orange-500 font-semibold hover:underline">
          Back to login
        </Link>
      </div>

      <div hidden {...register("email")} />
    </form>
  );
}

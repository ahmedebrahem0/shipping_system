// useLogin.ts
"use client";

import { createElement } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { LoaderCircle, CheckCircle2, CircleAlert } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth/authSlice";
import { useLoginMutation } from "@/store/slices/api/apiSlice";
import type { DecodedToken } from "@/types/auth.types";
import type { Role } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    const toastId = toast.loading("Signing you in...", {
      description: "Checking your credentials and preparing your dashboard.",
      duration: Infinity,
      icon: createElement(LoaderCircle, {
        className: "size-4 animate-spin text-sky-600",
      }),
      style: {
        borderRadius: "18px",
        padding: "16px 18px",
        border: "1px solid rgba(226, 232, 240, 1)",
        background: "rgba(255,255,255,0.98)",
        boxShadow: "0 18px 50px rgba(15, 23, 42, 0.14)",
        minWidth: "360px",
      },
    });

    try {
      const response = (await login({ email, password }).unwrap()) as string;
      const token =
        typeof response === "string"
          ? response
          : (response as { data: string }).data;

      if (!token) {
        throw new Error("No token received");
      }

      const decoded: DecodedToken = jwtDecode(token);
      const role = decoded.role || ("Admin" as Role);

      dispatch(
        setCredentials({
          user: {
            id: decoded.nameid,
            name: decoded.unique_name,
            email: decoded.email,
            role: role,
          },
          token: token,
        })
      );

      Cookies.set("token", token, { expires: 1 });
      router.push(ROUTES.DASHBOARD);

      toast.success("Welcome back!", {
        id: toastId,
        description: "Login completed successfully.",
        duration: 3000,
        icon: createElement(CheckCircle2, {
          className: "size-4 text-emerald-600",
        }),
        style: {
          borderRadius: "18px",
          padding: "16px 18px",
          border: "1px solid rgba(16, 185, 129, 0.18)",
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.14)",
          minWidth: "360px",
        },
      });
    } catch {
      toast.error("Invalid email or password", {
        id: toastId,
        description: "Please check your credentials and try again.",
        duration: 4000,
        style: {
          borderRadius: "18px",
          padding: "16px 18px",
          border: "1px solid rgba(244, 63, 94, 0.18)",
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.14)",
          minWidth: "360px",
        },
      });
    }
  };

  return { handleLogin, isLoading };
};
// useLogin.ts
// Handles login logic - sends credentials, decodes token, stores auth state

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth/authSlice";
import { useLoginMutation } from "@/store/slices/api/apiSlice";
import type { DecodedToken } from "@/types/auth.types";
import { ROUTES } from "@/constants/routes";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      // 1. بنبعت للسيرفر
      const response = await login({ email, password }).unwrap();

      // 2. بنفك التوكن
   const decoded: DecodedToken = jwtDecode(response);

      // 3. بنخزن في Redux
      dispatch(
        setCredentials({
          user: {
            id: decoded.nameid,
            name: decoded.unique_name,
            email: decoded.email,
            role: decoded.role,
          },
          token: response.token,
        })
      );

      // 4. بنخزن في cookies عشان الـ middleware
      Cookies.set("token", response.token, { expires: 1 });

      // 5. بنعمل redirect
      router.push(ROUTES.DASHBOARD);
      toast.success("Welcome back!");

    } catch {
      toast.error("Invalid email or password");
    }
  };

  return { handleLogin, isLoading };
};
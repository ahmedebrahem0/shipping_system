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
import type { Role } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password }).unwrap();

      // Handle both direct token and wrapped response
      const token = typeof response === 'string' ? response : response.data;
      
      if (!token) {
        throw new Error("No token received");
      }

      const decoded: DecodedToken = jwtDecode(token);

      // Role not in token - default to Admin for now
      const role = decoded.role || "Admin" as Role;

      // 3. بنخزن في Redux
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

      // 4. بنخزن في cookies عشان الـ middleware
      Cookies.set("token", token, { expires: 1 });
      router.push(ROUTES.DASHBOARD);
      toast.success("Welcome back!");

    } catch {
      toast.error("Invalid email or password");
    }
  };

  return { handleLogin, isLoading };
};
// AuthProvider.tsx
// Reads token from cookies on app start and restores user state in Redux

"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth/authSlice";
import type { DecodedToken, AuthUser } from "@/types/auth.types";
import type { Role } from "@/constants/roles";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      if (isAuthenticated) {
        setInitialized(true);
        return;
      }

      const token = Cookies.get("token");
      if (token) {
        try {
          const storedUser = localStorage.getItem("user");
          
          if (storedUser) {
            const user: AuthUser = JSON.parse(storedUser);
            dispatch(
              setCredentials({
                user,
                token,
              })
            );
            setInitialized(true);
            return;
          }

          const decoded: DecodedToken = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            const role = decoded.role || "Admin" as Role;
            dispatch(
              setCredentials({
                user: {
                  id: decoded.nameid,
                  name: decoded.unique_name,
                  email: decoded.email,
                  role,
                },
                token,
              })
            );
          } else {
            Cookies.remove("token");
            localStorage.removeItem("user");
          }
        } catch {
          Cookies.remove("token");
          localStorage.removeItem("user");
        }
      }
      setInitialized(true);
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  if (!initialized) return null;

  return <>{children}</>;
}
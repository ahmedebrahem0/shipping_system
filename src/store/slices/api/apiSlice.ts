// apiSlice.ts
// Base RTK Query slice - all feature API slices extend from this

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";
import type { LoginRequest, LoginResponse } from "@/types/auth.types";
import type { ApiResponse } from "@/types/api.types";
import { ENDPOINTS } from "@/constants/api-endpoints";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    "Orders",
    "Merchants",
    "Deliveries",
    "Branches",
    "Governments",
    "Cities",
    "Employees",
    "Settings",
    "Reports",
  ],

  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = apiSlice;
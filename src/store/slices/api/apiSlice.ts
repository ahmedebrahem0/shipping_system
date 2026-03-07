// apiSlice.ts
// Base RTK Query slice - all feature API slices extend from this

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store";

export const apiSlice = createApi({
  reducerPath: "api",
  
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    
    // بيحط الـ token تلقائياً في كل request
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // هنا بنحدد الـ tags اللي هنستخدمها للـ cache invalidation
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

  // الـ endpoints هتتعمل في كل feature لوحده
  endpoints: () => ({}),
});
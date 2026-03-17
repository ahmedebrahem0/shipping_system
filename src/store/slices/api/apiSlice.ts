// apiSlice.ts
// Base RTK Query slice - all feature API slices extend from this

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest } from "@/types/auth.types";
import type { BranchCreateRequest, BranchEditRequest, BranchesData, Branch } from "@/types/branch.types";
import type { GovernmentCreateRequest, GovernmentEditRequest, GovernmentsData } from "@/types/government.types";
import type { CityCreateRequest, CityEditRequest, CitiesResponse } from "@/types/city.types";
import type { ApiResponse } from "@/types/api.types";
import type { MerchantCreateRequest, MerchantEditRequest, MerchantsResponse } from "@/types/merchant.types";
import { ENDPOINTS } from "@/constants/api-endpoints";

interface RootState {
  auth: {
    token: string | null;
  };
}

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
    // Auth
    login: builder.mutation<string, LoginRequest>({
      query: (credentials) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),

    // Branches
    getBranches: builder.query<ApiResponse<BranchesData>, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: ENDPOINTS.BRANCHES.GET_ALL,
        params,
      }),
      providesTags: ["Branches"],
    }),

    createBranch: builder.mutation<ApiResponse<Branch>, BranchCreateRequest>({
      query: (data) => ({
        url: ENDPOINTS.BRANCHES.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),

    updateBranch: builder.mutation<ApiResponse<Branch>, { id: number; data: BranchEditRequest }>({
      query: ({ id, data }) => ({
        url: ENDPOINTS.BRANCHES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),

    deleteBranch: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: ENDPOINTS.BRANCHES.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Branches"],
    }),

    // Governments
    getGovernments: builder.query<GovernmentsData, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: ENDPOINTS.GOVERNMENTS.GET_ALL,
        params,
      }),
      providesTags: ["Governments"],
    }),

    createGovernment: builder.mutation<void, GovernmentCreateRequest>({
      query: (data) => ({
        url: ENDPOINTS.GOVERNMENTS.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Governments"],
    }),

    updateGovernment: builder.mutation<void, { id: number; data: GovernmentEditRequest }>({
      query: ({ id, data }) => ({
        url: ENDPOINTS.GOVERNMENTS.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Governments"],
    }),

    deleteGovernment: builder.mutation<void, number>({
      query: (id) => ({
        url: ENDPOINTS.GOVERNMENTS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Governments"],
    }),

    // Cities
    getCities: builder.query<CitiesResponse, { page?: number; pageSize?: number }>({
      query: (params) => ({
        url: ENDPOINTS.CITIES.GET_ALL,
        params,
      }),
      providesTags: ["Cities"],
    }),

    createCity: builder.mutation<void, CityCreateRequest>({
      query: (data) => ({
        url: ENDPOINTS.CITIES.CREATE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),

    updateCity: builder.mutation<void, { id: number; data: CityEditRequest }>({
      query: ({ id, data }) => ({
        url: ENDPOINTS.CITIES.UPDATE(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cities"],
    }),

    deleteCity: builder.mutation<void, number>({
      query: (id) => ({
        url: ENDPOINTS.CITIES.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Cities"],
    }),

  // Merchants
// Merchants
getMerchants: builder.query<MerchantsResponse, { page?: number; pageSize?: number; searchTxt?: string }>({
  query: (params) => ({
    url: ENDPOINTS.MERCHANTS.GET_ALL,
    params,
  }),
  providesTags: ["Merchants"],
}),

getMerchantById: builder.query<MerchantsResponse, number>({
  query: (id) => ({
    url: ENDPOINTS.MERCHANTS.GET_BY_ID(id),
  }),
  providesTags: ["Merchants"],
}),

createMerchant: builder.mutation<void, MerchantCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.MERCHANTS.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Merchants"],
}),

updateMerchant: builder.mutation<void, { id: number; data: MerchantEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.MERCHANTS.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Merchants"],
}),

deleteMerchant: builder.mutation<void, number>({
  query: (id) => ({
    url: ENDPOINTS.MERCHANTS.DELETE(id),
    method: "DELETE",
  }),
  invalidatesTags: ["Merchants"],
}),

})
});

export const {
  useLoginMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetGovernmentsQuery,
  useCreateGovernmentMutation,
  useUpdateGovernmentMutation,
  useDeleteGovernmentMutation,
  useGetCitiesQuery,
  useCreateCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetMerchantsQuery,
useGetMerchantByIdQuery,
useCreateMerchantMutation,
useUpdateMerchantMutation,
useDeleteMerchantMutation,
} = apiSlice;

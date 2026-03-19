// apiSlice.ts
// Base RTK Query slice - all feature API slices extend from this

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest } from "@/types/auth.types";
import type { BranchCreateRequest, BranchEditRequest, BranchesData, Branch } from "@/types/branch.types";
import type { GovernmentCreateRequest, GovernmentEditRequest, GovernmentsData } from "@/types/government.types";
import type { CityCreateRequest, CityEditRequest, CitiesResponse } from "@/types/city.types";
import type { ApiResponse } from "@/types/api.types";
import type { MerchantCreateRequest, MerchantEditRequest, MerchantsResponse, MerchantResponse } from "@/types/merchant.types";
import type { Delivery, DeliveryCreateRequest, DeliveryEditRequest } from "@/types/delivery.types";
import type { EmployeesData, Employee, EmployeeCreateRequest, EmployeeEditRequest } from "@/types/employee.types";
import type { DashboardStatsResponse } from "@/types/dashboard.types";
import type { ShippingType, ShippingTypeCreateRequest, ShippingTypeEditRequest } from "@/types/shippingType.types";
import type { WeightPricingRequest } from "@/types/weightPricing.types";
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
    "ShippingTypes",
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

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<{ isValid: boolean; message: string }, { email: string; otp: string }>({
      query: (data) => ({
        url: ENDPOINTS.AUTH.VERIFY_OTP,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { email: string; otp: string; newPassword: string }>({
      query: (data) => ({
        url: ENDPOINTS.AUTH.RESET_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),

    // Dashboard
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: ENDPOINTS.DASHBOARD.GET_STATS,
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

getMerchantById: builder.query<MerchantResponse, number>({
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
// Deliveries
getDeliveries: builder.query<Delivery[], void>({
  query: () => ({
    url: ENDPOINTS.DELIVERIES.GET_ALL,
  }),
  providesTags: ["Deliveries"],
}),

getDeliveryById: builder.query<Delivery, number>({
  query: (id) => ({
    url: ENDPOINTS.DELIVERIES.GET_BY_ID(id),
  }),
  providesTags: ["Deliveries"],
}),

createDelivery: builder.mutation<void, DeliveryCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.DELIVERIES.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Deliveries"],
}),

updateDelivery: builder.mutation<void, { id: number; data: DeliveryEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.DELIVERIES.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Deliveries"],
}),

deleteDelivery: builder.mutation<void, number>({
  query: (id) => ({
    url: ENDPOINTS.DELIVERIES.DELETE(id),
    method: "DELETE",
  }),
  invalidatesTags: ["Deliveries"],
}),

// Employees
getEmployees: builder.query<EmployeesData, { pageIndex?: number; pageSize?: number }>({
  query: (params) => ({
    url: ENDPOINTS.EMPLOYEES.GET_ALL,
    params,
  }),
  providesTags: ["Employees"],
}),

getEmployeeById: builder.query<Employee, number>({
  query: (id) => ({
    url: ENDPOINTS.EMPLOYEES.GET_BY_ID(id),
  }),
  providesTags: ["Employees"],
}),

createEmployee: builder.mutation<void, EmployeeCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.EMPLOYEES.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Employees"],
}),

updateEmployee: builder.mutation<void, { id: number; data: EmployeeEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.EMPLOYEES.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Employees"],
}),

deleteEmployee: builder.mutation<void, number>({
  query: (id) => ({
    url: ENDPOINTS.EMPLOYEES.DELETE(id),
    method: "DELETE",
  }),
  invalidatesTags: ["Employees"],
}),

searchEmployees: builder.query<Employee[], string>({
  query: (term) => ({
    url: ENDPOINTS.EMPLOYEES.SEARCH_BY_NAME,
    params: { term },
  }),
}),
// Shipping Types
getShippingTypes: builder.query<ShippingType[], void>({
  query: () => ({
    url: ENDPOINTS.SHIPPING_TYPES.GET_ALL,
  }),
  providesTags: ["ShippingTypes"],
}),

createShippingType: builder.mutation<void, ShippingTypeCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.SHIPPING_TYPES.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["ShippingTypes"],
}),

updateShippingType: builder.mutation<void, { id: number; data: ShippingTypeEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.SHIPPING_TYPES.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["ShippingTypes"],
}),

deleteShippingType: builder.mutation<void, number>({
  query: (id) => ({
    url: ENDPOINTS.SHIPPING_TYPES.DELETE(id),
    method: "DELETE",
  }),
  invalidatesTags: ["ShippingTypes"],
}),
// Weight Pricing
createWeightPricing: builder.mutation<void, WeightPricingRequest>({
  query: (data) => ({
    url: ENDPOINTS.WEIGHT_PRICING.CREATE,
    method: "PUT",
    body: data,
  }),
}),

updateWeightPricing: builder.mutation<void, WeightPricingRequest>({
  query: (data) => ({
    url: ENDPOINTS.WEIGHT_PRICING.UPDATE,
    method: "PUT",
    body: data,
  }),
}),
})
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGetDashboardStatsQuery,
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
useGetDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSearchEmployeesQuery,
  useGetShippingTypesQuery,
useCreateShippingTypeMutation,
useUpdateShippingTypeMutation,
useDeleteShippingTypeMutation,
useCreateWeightPricingMutation,
useUpdateWeightPricingMutation,
} = apiSlice;

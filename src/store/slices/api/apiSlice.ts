// apiSlice.ts
// Base RTK Query slice - all feature API slices extend from this

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest } from "@/types/auth.types";
import type { BranchCreateRequest, BranchEditRequest, BranchesData, Branch } from "@/types/branch.types";
import type { GovernmentCreateRequest, GovernmentEditRequest, GovernmentsData, Government } from "@/types/government.types";
import type { CityCreateRequest, CityEditRequest, CitiesResponse } from "@/types/city.types";
import type { ApiResponse } from "@/types/api.types";
import type { MerchantCreateRequest, MerchantEditRequest, MerchantsResponse, MerchantResponse } from "@/types/merchant.types";
import type { Delivery, DeliveryCreateRequest, DeliveryEditRequest } from "@/types/delivery.types";
import type { EmployeesData, Employee, EmployeeCreateRequest, EmployeeEditRequest } from "@/types/employee.types";
import type { DashboardStatsResponse } from "@/types/dashboard.types";
import type { ShippingType, ShippingTypeCreateRequest, ShippingTypeEditRequest } from "@/types/shippingType.types";
import type { WeightPricingRequest } from "@/types/weightPricing.types";
import type { ProfileResponse } from "@/types/profile.types";
import type { OrderReportResponse, OrderReportFilters } from "@/types/report.types";
import type { SettingsResponse, SettingCreateRequest, SettingEditRequest } from "@/types/settings.types";
import type {Role,Permission,CreateRoleRequest,UpdateRoleRequest,CreateRolePermissionRequest,UpdateRolePermissionRequest,} from "@/types/role.types";
import type {OrdersResponse,OrderDetailsResponse,OrderCreateRequest,OrderEditRequest,OrderFilters, ProductRequest,} from "@/types/order.types";
import { ENDPOINTS } from "@/constants/api-endpoints";
import type { Product } from "@/types/order.types";
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
    "Profile",
    "Reports",
    "Settings",
    "Roles",
"Permissions",
"RolePermissions",
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

    getGovernmentsByBranch: builder.query<Government[], number>({
      query: (branchId) => ({
        url: ENDPOINTS.GOVERNMENTS.GET_BY_BRANCH(branchId),
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

getMerchantById: builder.query<ApiResponse<MerchantResponse>, number>({
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

getDeliveryGovernmentsByBranch: builder.query<Government[], number>({
  query: (branchId) => ({
    url: ENDPOINTS.DELIVERIES.GET_GOVERNMENTS_BY_BRANCH(branchId),
  }),
  providesTags: ["Governments"],
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
  queryFn: async (_args, _api, _extraOptions, baseQuery) => {
    const result = await baseQuery({
      url: ENDPOINTS.SHIPPING_TYPES.GET_ALL,
    });
    const raw = result.data as unknown;
    if (Array.isArray(raw)) {
      return { data: raw.filter((t) => (t as ShippingType).isDeleted !== true) };
    }
    if (raw && typeof raw === "object" && "data" in raw) {
      const wrapped = raw as { data: { shippingTypes?: ShippingType[] } };
      const types = wrapped.data?.shippingTypes ?? [];
      return { data: types.filter((t) => !t.isDeleted) };
    }
    return { data: [] as ShippingType[] };
  },
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
// Profile
getProfile: builder.query<ProfileResponse, string>({
  query: (id) => ({
    url: ENDPOINTS.PROFILE.GET(id),
  }),
  providesTags: ["Profile"],
}),

uploadProfileImage: builder.mutation<void, { id: string; imageFile: FormData }>({
  query: ({ id, imageFile }) => ({
    url: ENDPOINTS.PROFILE.UPLOAD_IMAGE(id),
    method: "POST",
    body: imageFile,
  }),
  invalidatesTags: ["Profile"],
}),

// Reports
getOrderReport: builder.query<OrderReportResponse, OrderReportFilters>({
  query: (params) => ({
    url: ENDPOINTS.REPORTS.GET,
    params,
  }),
  providesTags: ["Reports"],
}),
// Settings
  getSettings: builder.query<SettingsResponse, void>({
  query: () => ({
    url: ENDPOINTS.SETTINGS.GET,
  }),
  providesTags: ["Settings"],
}),

createSetting: builder.mutation<void, SettingCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.SETTINGS.GET,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Settings"],
}),

updateSetting: builder.mutation<void, { id: number; data: SettingEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.SETTINGS.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Settings"],
}),
// Roles
getRoles: builder.query<Role[], { includeDeleted?: boolean }>({

  query: (params) => ({
    url: ENDPOINTS.ROLE.GET_ALL,
    params,
  }),
  providesTags: ["Roles"],
}),

createRole: builder.mutation<void, CreateRoleRequest>({
  query: (data) => ({
    url: ENDPOINTS.ROLE.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Roles"],
}),

updateRole: builder.mutation<void, { id: string; data: UpdateRoleRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.ROLE.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Roles"],
}),

deleteRole: builder.mutation<void, string>({
  query: (id) => ({
    url: ENDPOINTS.ROLE.DELETE(id),
    method: "DELETE",
  }),
  invalidatesTags: ["Roles"],
}),

// Permissions
getPermissions: builder.query<Permission[], void>({
  query: () => ({
    url: ENDPOINTS.PERMISSIONS.GET_ALL,
  }),
  providesTags: ["Permissions"],
}),

// Role Permissions
getRolePermissions: builder.query<Role[], void>({
  query: () => ({
    url: ENDPOINTS.ROLE_PERMISSION.GET_ALL,
  }),
  providesTags: ["RolePermissions"],
}),

createRolePermission: builder.mutation<void, { roleId: string; permissionId: number; data: CreateRolePermissionRequest }>({
  query: ({ roleId, permissionId, data }) => ({
    url: ENDPOINTS.ROLE_PERMISSION.CREATE(roleId, permissionId),
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["RolePermissions", "Roles"],
}),

updateRolePermission: builder.mutation<void, { roleId: string; permissionId: number; data: UpdateRolePermissionRequest }>({
  query: ({ roleId, permissionId, data }) => ({
    url: ENDPOINTS.ROLE_PERMISSION.UPDATE(roleId, permissionId),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["RolePermissions", "Roles"],
}),
// Orders
getOrders: builder.query<OrdersResponse, { status?: string; filters?: OrderFilters }>({
  query: ({ status, filters }) => ({
    url: ENDPOINTS.ORDERS.GET_ALL(status || ""),
    params: filters,
  }),
  providesTags: ["Orders"],
  transformErrorResponse: (response) => {
    if (response.status === 404) {
      return { data: { data: { orders: [], totalOrders: 0 } } };
    }
    return response;
  },
}),

getOrderById: builder.query<OrderDetailsResponse, number>({
  query: (id) => ({
    url: ENDPOINTS.ORDERS.GET_BY_ID(id),
  }),
  providesTags: ["Orders"],
}),

getMerchantOrders: builder.query<OrdersResponse, { merchantId: number; status?: string; filters?: OrderFilters }>({
  query: ({ merchantId, status, filters }) => ({
    url: ENDPOINTS.ORDERS.GET_BY_MERCHANT(merchantId, status || ""),
    params: filters,
  }),
  providesTags: ["Orders"],
  transformErrorResponse: (response) => {
    if (response.status === 404) {
      return { data: { data: { orders: [], totalOrders: 0 } } };
    }
    return response;
  },
}),

getDeliveryOrders: builder.query<OrdersResponse, { deliveryId: number; status?: string; filters?: OrderFilters }>({
  query: ({ deliveryId, status, filters }) => ({
    url: ENDPOINTS.ORDERS.GET_BY_DELIVERY(deliveryId, status || ""),
    params: filters,
  }),
  providesTags: ["Orders"],
  transformErrorResponse: (response) => {
    if (response.status === 404) {
      return { data: { data: { orders: [], totalOrders: 0 } } };
    }
    return response;
  },
}),

createOrder: builder.mutation<void, OrderCreateRequest>({
  query: (data) => ({
    url: ENDPOINTS.ORDERS.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Orders"],
}),

updateOrder: builder.mutation<void, { id: number; data: OrderEditRequest }>({
  query: ({ id, data }) => ({
    url: ENDPOINTS.ORDERS.UPDATE(id),
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["Orders"],
}),

deleteOrder: builder.mutation<void, { orderId: number; userId?: string }>({
  query: ({ orderId, userId }) => ({
    url: ENDPOINTS.ORDERS.DELETE(orderId),
    method: "DELETE",
    params: userId ? { userId } : undefined,
  }),
  invalidatesTags: ["Orders"],
}),

changeOrderStatus: builder.mutation<void, { orderId: number; userId: string; newStatus: string; note?: string }>({
  query: ({ orderId, userId, newStatus, note }) => ({
    url: ENDPOINTS.ORDERS.CHANGE_STATUS(orderId, userId, newStatus),
    method: "PUT",
    params: note ? { note } : undefined,
  }),
  invalidatesTags: ["Orders"],
}),

assignDelivery: builder.mutation<void, { orderId: number; deliveryId: number }>({
  query: ({ orderId, deliveryId }) => ({
    url: ENDPOINTS.ORDERS.ASSIGN_DELIVERY(orderId, deliveryId),
    method: "PUT",
  }),
  invalidatesTags: ["Orders"],
}),
// Products
addProduct: builder.mutation<void, ProductRequest>({
  query: (data) => ({
    url: ENDPOINTS.PRODUCT.CREATE,
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Orders"],
}),
// Products
getProducts: builder.query<Product[], void>({
  query: () => ({
    url: ENDPOINTS.PRODUCT.GET_ALL,
  }),
  providesTags: ["Orders"],
}),
})
});

export const {
  useAddProductMutation,
  useGetProductsQuery,
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
  useGetGovernmentsByBranchQuery,
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
useGetDeliveryGovernmentsByBranchQuery,
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
useGetProfileQuery,
useUploadProfileImageMutation,
  useGetOrderReportQuery,
useGetSettingsQuery,
useCreateSettingMutation,
  useUpdateSettingMutation,
useGetRolesQuery,
useCreateRoleMutation,
useUpdateRoleMutation,
useDeleteRoleMutation,
useGetPermissionsQuery,
useGetRolePermissionsQuery,
useCreateRolePermissionMutation,
useUpdateRolePermissionMutation,
useGetOrdersQuery,
useGetOrderByIdQuery,
useGetMerchantOrdersQuery,
useGetDeliveryOrdersQuery,
useCreateOrderMutation,
useUpdateOrderMutation,
useDeleteOrderMutation,
useChangeOrderStatusMutation,
useAssignDeliveryMutation,
} = apiSlice;

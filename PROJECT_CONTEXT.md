# Shipping System - Project Context

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Redux Toolkit + RTK Query
- React Hook Form + Yup
- Tailwind CSS + shadcn/ui
- Lucide React
- Sonner (notifications)

## Backend
- Base URL: http://localhost:5050
- Auth: JWT Bearer Token
- Swagger: http://localhost:5050/swagger/index.html

## Roles
- Admin
- Employee
- Merchant
- Delivery

## Project Structure
```
src/
├── app/
│   ├── (auth)/          # login, forgot-password, verify-otp, reset-password
│   └── (dashboard)/     # dashboard, orders, merchants, deliveries, branches, settings, reports, profile
├── components/
│   ├── common/          # ConfirmDialog, EmptyState, ErrorMessage, Loader, PageHeader, StatusBadge
│   ├── layout/          # Sidebar, Header, Breadcrumbs, MobileNav
│   └── ui/              # shadcn components
├── constants/
│   ├── api-endpoints.ts # All API endpoints
│   ├── roles.ts         # Admin, Employee, Merchant, Delivery
│   ├── routes.ts        # All app routes
│   ├── orderStatuses.ts # Order statuses + labels + colors
│   ├── paymentTypes.ts  # Cash, Visa, Vodafone
│   └── shippingTypes.ts # Discount types, Order types
├── features/
│   ├── auth/            # login, forgot-password, verify-otp, reset-password
│   ├── orders/          # CRUD + assign delivery + change status
│   ├── merchants/       # CRUD
│   ├── deliveries/      # CRUD
│   ├── branches/        # CRUD
│   ├── dashboard/       # stats
│   └── settings/        # cities, governments, pricing
├── lib/
│   ├── api/             # axiosInstance (RTK Query baseQuery)
│   └── utils/           # cn.ts, formatters.ts, permissions.ts
├── store/
│   ├── index.ts         # Redux store
│   ├── hooks.ts         # useAppDispatch, useAppSelector
│   └── slices/
│       ├── authSlice.ts # user, token, role
│       ├── uiSlice.ts   # sidebar open/close
│       └── api/
│           └── apiSlice.ts # RTK Query base
└── types/
    ├── api.types.ts     # ApiResponse<T>, PaginationParams
    ├── auth.types.ts
    ├── order.types.ts
    ├── merchant.types.ts
    ├── delivery.types.ts
    └── index.ts

## File Order (How we build each feature)
types → schema → hooks → components → page

## Completed Files
- src/types/api.types.ts ✅
- src/constants/api-endpoints.ts ✅
- src/constants/roles.ts ✅
- src/constants/routes.ts ✅
- src/constants/orderStatuses.ts ✅
- src/constants/paymentTypes.ts ✅
- src/constants/shippingTypes.ts ✅
- src/lib/utils/cn.ts ✅

## In Progress
- src/lib/utils/formatters.ts
```

## API Endpoints Summary
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {

  AUTH: {
    LOGIN: `${BASE_URL}/api/Account`,
    FORGOT_PASSWORD: `${BASE_URL}/api/Account/forgot-password-otp`,
    VERIFY_OTP: `${BASE_URL}/api/Account/verify-forgot-password-otp`,
    RESET_PASSWORD: `${BASE_URL}/api/Account/reset-password-session`,
  },

  ORDERS: {
    GET_ALL: (status: string) => `${BASE_URL}/api/Order/${status}/all`,
    GET_BY_MERCHANT: (merchantId: number, status: string) => `${BASE_URL}/api/Order/Merchant/${merchantId}/${status}/all`,
    GET_BY_DELIVERY: (deliveryId: number, status: string) => `${BASE_URL}/api/Order/Delivery/${deliveryId}/${status}/all`,
    CREATE: `${BASE_URL}/api/Order`,
    UPDATE: (id: number) => `${BASE_URL}/api/Order/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Order/${id}`,
    CHANGE_STATUS: (orderId: number, userId: string, status: string) => `${BASE_URL}/api/Order/${orderId}/${userId}/${status}`,
    ASSIGN_DELIVERY: (orderId: number, deliveryId: number) => `${BASE_URL}/api/Order/${orderId}/${deliveryId}`,
  },

  MERCHANTS: {
    GET_ALL: `${BASE_URL}/api/Merchant/all`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/Merchant/${id}`,
    CREATE: `${BASE_URL}/api/Merchant`,
    UPDATE: (id: number) => `${BASE_URL}/api/Merchant/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Merchant/${id}`,
  },

  DELIVERIES: {
    GET_ALL: `${BASE_URL}/api/Delivery/all`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/Delivery/${id}`,
    GET_BY_BRANCH: (branchId: number) => `${BASE_URL}/api/Delivery/Branch/${branchId}`,
    CREATE: `${BASE_URL}/api/Delivery`,
    UPDATE: (id: number) => `${BASE_URL}/api/Delivery/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Delivery/${id}`,
  },

  BRANCHES: {
    GET_ALL: `${BASE_URL}/api/Branch/all`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/Branch/${id}`,
    CREATE: `${BASE_URL}/api/Branch`,
    UPDATE: (id: number) => `${BASE_URL}/api/Branch/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Branch/${id}`,
  },

  GOVERNMENTS: {
    GET_ALL: `${BASE_URL}/api/Government/all`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/Government/${id}`,
    CREATE: `${BASE_URL}/api/Government`,
    UPDATE: (id: number) => `${BASE_URL}/api/Government/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Government/${id}`,
  },

  CITIES: {
    GET_ALL: `${BASE_URL}/api/City/all`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/City/${id}`,
    CREATE: `${BASE_URL}/api/City`,
    UPDATE: (id: number) => `${BASE_URL}/api/City/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/City/${id}`,
  },

  EMPLOYEES: {
    GET_ALL: `${BASE_URL}/api/Employee`,
    GET_BY_ID: (id: number) => `${BASE_URL}/api/Employee/${id}`,
    GET_BY_ROLE: `${BASE_URL}/api/Employee/GetEmployeesByRole`,
    CREATE: `${BASE_URL}/api/Employee`,
    UPDATE: (id: number) => `${BASE_URL}/api/Employee/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/Employee/${id}`,
  },

  SETTINGS: {
    GET: `${BASE_URL}/api/Setting`,
    UPDATE: (id: number) => `${BASE_URL}/api/Setting/${id}`,
  },

  SHIPPING_TYPES: {
    GET_ALL: `${BASE_URL}/api/ShippingType/All`,
    CREATE: `${BASE_URL}/api/ShippingType`,
    UPDATE: (id: number) => `${BASE_URL}/api/ShippingType/${id}`,
    DELETE: (id: number) => `${BASE_URL}/api/ShippingType/${id}`,
  },

  WEIGHT_PRICING: {
    CREATE: `${BASE_URL}/api/WeightPricing`,
    UPDATE: `${BASE_URL}/api/WeightPricing`,
  },

  REPORTS: {
    GET: `${BASE_URL}/api/OrderReport`,
  },

  PROFILE: {
    GET: (id: string) => `${BASE_URL}/api/Profile/${id}`,
    UPLOAD_IMAGE: (id: string) => `${BASE_URL}/api/Profile/${id}/upload-profile-image`,
  },

} as const;


NEXT_PUBLIC_API_URL=http://localhost:5050
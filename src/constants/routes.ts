export const ROUTES = {

  // Auth
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",

  // Dashboard
  DASHBOARD: "/dashboard",

  // Orders
  ORDERS: "/orders",
  ORDER_CREATE: "/orders/create",
  ORDER_DETAILS: (id: number) => `/orders/${id}`,

  // Merchants
  MERCHANTS: "/merchants",
  MERCHANT_CREATE: "/merchants/create",
  MERCHANT_DETAILS: (id: number) => `/merchants/${id}`,

  // Deliveries
  DELIVERIES: "/deliveries",
  DELIVERY_CREATE: "/deliveries/create",
  DELIVERY_DETAILS: (id: number) => `/deliveries/${id}`,

  // Employees
EMPLOYEES: "/employees",
EMPLOYEE_DETAILS: (id: number) => `/employees/${id}`,
EMPLOYEE_CREATE: "/employees/create",
SETTINGS: "/settings",
ROLES: "/settings/roles",
PERMISSIONS: "/settings/permissions",

  // Branches
  BRANCHES: "/branches",
  BRANCH_CREATE: "/branches/create",

  // Settings
  GOVERNMENTS: "/settings/governments",
  CITIES: "/settings/cities",
  SHIPPING_TYPES: "/settings/shipping-types",
  PRICING: "/settings/pricing",

  // Setup
  SETUP: "/setup",

  // Reports
  REPORTS: "/reports",

  // Profile
  PROFILE: "/profile",



} as const;
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
    SEARCH_BY_NAME: `${BASE_URL}/api/Employee/SearchByName`,
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
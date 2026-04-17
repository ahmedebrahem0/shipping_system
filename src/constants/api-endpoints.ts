export const API_BASE_PATH = "/api";
export const ASSET_PROXY_BASE_PATH = "/backend";

export const ENDPOINTS = {

  AUTH: {
    LOGIN: `${API_BASE_PATH}/Account`,
    FORGOT_PASSWORD: `${API_BASE_PATH}/Account/forgot-password-otp`,
    VERIFY_OTP: `${API_BASE_PATH}/Account/verify-forgot-password-otp`,
    RESET_PASSWORD: `${API_BASE_PATH}/Account/reset-password-session`,
  },

  ORDERS: {
    GET_ALL: (status: string) => status ? `${API_BASE_PATH}/Order/${status}/all` : `${API_BASE_PATH}/Order/all`,

    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Order/${id}`,

    GET_BY_MERCHANT: (merchantId: number, status: string) =>
      status
        ? `${API_BASE_PATH}/Order/Merchant/${merchantId}/${status}/all`
        : `${API_BASE_PATH}/Order/Merchant/${merchantId}/all`,

    GET_BY_DELIVERY: (deliveryId: number, status: string) => status ? `${API_BASE_PATH}/Order/Delivery/${deliveryId}/${status}/all` : `${API_BASE_PATH}/Order/Delivery/${deliveryId}/all`,

    CREATE: `${API_BASE_PATH}/Order`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Order/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Order/${id}`,
    CHANGE_STATUS: (orderId: number, userId: string, status: string) => `${API_BASE_PATH}/Order/${orderId}/${userId}/${status}`,
    ASSIGN_DELIVERY: (orderId: number, deliveryId: number) => `${API_BASE_PATH}/Order/${orderId}/${deliveryId}`,
  },

  MERCHANTS: {
    GET_ALL: `${API_BASE_PATH}/Merchant/all`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Merchant/${id}`,
    CREATE: `${API_BASE_PATH}/Merchant`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Merchant/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Merchant/${id}`,
  },

  DELIVERIES: {
    GET_ALL: `${API_BASE_PATH}/Delivery/all`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Delivery/${id}`,
    GET_BY_BRANCH: (branchId: number) => `${API_BASE_PATH}/Delivery/Branch/${branchId}`,
    CREATE: `${API_BASE_PATH}/Delivery`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Delivery/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Delivery/${id}`,
    GET_GOVERNMENTS_BY_BRANCH: (branchId: number) => `${API_BASE_PATH}/Delivery/GovernmentByBranch/${branchId}`,
  },

  BRANCHES: {
    GET_ALL: `${API_BASE_PATH}/Branch/all`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Branch/${id}`,
    CREATE: `${API_BASE_PATH}/Branch`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Branch/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Branch/${id}`,
  },

  GOVERNMENTS: {
    GET_ALL: `${API_BASE_PATH}/Government/all`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Government/${id}`,
    GET_BY_BRANCH: (branchId: number) => `${API_BASE_PATH}/Government/Branch/${branchId}`,
    CREATE: `${API_BASE_PATH}/Government`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Government/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Government/${id}`,
  },

  CITIES: {
    GET_ALL: `${API_BASE_PATH}/City/all`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/City/${id}`,
    CREATE: `${API_BASE_PATH}/City`,
    UPDATE: (id: number) => `${API_BASE_PATH}/City/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/City/${id}`,
  },
  

  EMPLOYEES: {
    GET_ALL: `${API_BASE_PATH}/Employee`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Employee/${id}`,
    GET_BY_ROLE: `${API_BASE_PATH}/Employee/GetEmployeesByRole`,
    SEARCH_BY_NAME: `${API_BASE_PATH}/Employee/SearchByName`,
    CREATE: `${API_BASE_PATH}/Employee`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Employee/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/Employee/${id}`,
  },

  SETTINGS: {
    GET: `${API_BASE_PATH}/Setting`,
    UPDATE: (id: number) => `${API_BASE_PATH}/Setting/${id}`,
  },

  SHIPPING_TYPES: {
    GET_ALL: `${API_BASE_PATH}/ShippingType/All`,
    CREATE: `${API_BASE_PATH}/ShippingType`,
    UPDATE: (id: number) => `${API_BASE_PATH}/ShippingType/${id}`,
    DELETE: (id: number) => `${API_BASE_PATH}/ShippingType/${id}`,
  },

  WEIGHT_PRICING: {
    CREATE: `${API_BASE_PATH}/WeightPricing`,
    UPDATE: `${API_BASE_PATH}/WeightPricing`,
  },

  REPORTS: {
    GET: `${API_BASE_PATH}/OrderReport`,
  },

  PROFILE: {
    GET: (id: string) => `${API_BASE_PATH}/Profile/${id}`,
    UPLOAD_IMAGE: (id: string) => `${API_BASE_PATH}/Profile/${id}/upload-profile-image`,
  },

  DASHBOARD: {
    GET_STATS: `${API_BASE_PATH}/Dashboard`,
  },

// ====================== Roles & Permissions ======================
  ROLE: {
   GET_ALL: `${API_BASE_PATH}/Role`,
  GET_BY_ID: (id: string) => `${API_BASE_PATH}/Role/${id}`, 
  SEARCH: `${API_BASE_PATH}/Role/search`,                    
  CREATE: `${API_BASE_PATH}/Role`,
  UPDATE: (id: string) => `${API_BASE_PATH}/Role/${id}`,
  DELETE: (id: string) => `${API_BASE_PATH}/Role/${id}`,
  ASSIGN: `${API_BASE_PATH}/Role/AssignRole`, 
  },

  PERMISSIONS: {
    GET_ALL: `${API_BASE_PATH}/Permissions/all`,
  },

  ROLE_PERMISSION: {
    GET_ALL: `${API_BASE_PATH}/RolePermission/All`,
    CREATE: (roleId: string, permissionId: number) => 
      `${API_BASE_PATH}/RolePermission/${roleId}/${permissionId}`,
    UPDATE: (roleId: string, permissionId: number) => 
      `${API_BASE_PATH}/RolePermission/${roleId}/${permissionId}`,
  },

  PRODUCT: {
    GET_ALL: `${API_BASE_PATH}/Product`,
    GET_BY_ID: (id: number) => `${API_BASE_PATH}/Product/${id}`,
    UPDATE:(id: number) => `${API_BASE_PATH}/Product/${id}`,
  CREATE: `${API_BASE_PATH}/Product`,

},

} as const;

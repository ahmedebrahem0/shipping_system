import { ROLES, type Role } from "@/constants/roles";

// مين يقدر يدخل الـ dashboard
export const canAccessDashboard = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE].includes(role as never);
};

// مين يقدر يضيف / يعدل / يحذف merchants
export const canManageMerchants = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE].includes(role as never);
};

// مين يقدر يضيف / يعدل / يحذف deliveries
export const canManageDeliveries = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE].includes(role as never);
};

// مين يقدر يضيف order
export const canCreateOrder = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.MERCHANT].includes(role as never);
};

// مين يقدر يغير status الـ order
export const canChangeOrderStatus = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.DELIVERY].includes(role as never);
};

// مين يقدر يدخل الـ settings
export const canAccessSettings = (role: Role): boolean => {
  return role === ROLES.ADMIN;
};

// مين يقدر يشوف الـ reports
export const canAccessReports = (role: Role): boolean => {
  return [ROLES.ADMIN, ROLES.EMPLOYEE].includes(role as never);
};
export const ROLES = {
  ADMIN: "Admin",
  EMPLOYEE: "Employee", 
  MERCHANT: "Merchant",
  DELIVERY: "Delivery",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
// = "Admin" | "Employee" | "Merchant" | "Delivery"
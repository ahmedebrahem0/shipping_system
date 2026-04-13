export const ORDER_TYPES = {
  PICKUP_FROM_BRANCH: "PickupFromBranch",
  PICKUP_FROM_MERCHANT: "PickupFromMerchant",
} as const;

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  PickupFromBranch: "Pickup From Branch",
  PickupFromMerchant: "Pickup From Merchant",
};

export const PAYMENT_TYPES = {
  PREPAID: "Prepaid",
  PACKAGE_SWAP: "PackageSwap",
  CASH_ON_DELIVERY: "CashOnDelivery",
} as const;

export const DISCOUNT_TYPES = {
  FIXED: "Fixed",
  PERCENTAGE: "Percentage",
} as const;

export type DiscountType =
  (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  Fixed: "Fixed",
  Percentage: "Percentage",
};

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  Prepaid: "Prepaid",
  PackageSwap: "Package Swap",
  CashOnDelivery: "Cash On Delivery",
};


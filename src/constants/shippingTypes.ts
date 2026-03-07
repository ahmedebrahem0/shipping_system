export const DISCOUNT_TYPES = {
  FIXED: "Fixed",
  PERCENTAGE: "Percentage",
} as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[keyof typeof DISCOUNT_TYPES];

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  Fixed: "Fixed Amount",
  Percentage: "Percentage",
};

export const ORDER_TYPES = {
  DELIVERY: "Delivery",
  PICKUP: "Pickup",
} as const;

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  Delivery: "Delivery",
  Pickup: "Pickup",
};
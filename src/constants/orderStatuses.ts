export const ORDER_STATUSES = {
  NEW: "New",
  PENDING: "Pending",
  DELIVERED_TO_AGENT: "DeliveredToAgent",
  DELIVERED_TO_DELIVERY: "DeliveredToDelivery",
  DELIVERED: "Delivered",
  CANNOT_REACH: "CannotReach",
  POSTPONED: "Postponed",
  PARTIALLY_DELIVERED: "PartiallyDelivered",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  LOST_OR_DAMAGED: "LostOrDamaged",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  New: "New",
  Pending: "Pending",
  DeliveredToAgent: "Delivered To Agent",
  DeliveredToDelivery: "Delivered To Delivery",
  Delivered: "Delivered",
  CannotReach: "Cannot Reach",
  Postponed: "Postponed",
  PartiallyDelivered: "Partially Delivered",
  Cancelled: "Cancelled",
  Rejected: "Rejected",
  LostOrDamaged: "Lost Or Damaged",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  DeliveredToAgent: "bg-purple-100 text-purple-700",
  DeliveredToDelivery: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  CannotReach: "bg-orange-100 text-orange-700",
  Postponed: "bg-gray-100 text-gray-700",
  PartiallyDelivered: "bg-teal-100 text-teal-700",
  Cancelled: "bg-red-100 text-red-700",
  Rejected: "bg-red-200 text-red-800",
  LostOrDamaged: "bg-slate-100 text-slate-700",
};
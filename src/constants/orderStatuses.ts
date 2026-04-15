// orderStatuses.ts
export const ORDER_STATUSES = {
  NEW: "New",
  PENDING: "Pending",
  DELIVERED_TO_AGENT: "DeliveredToAgent",
  DELIVERED: "Delivered",
  CANCELED_BY_RECIPIENT: "CanceledByRecipient",
  PARTIALLY_DELIVERED: "PartiallyDelivered",
  POSTPONED: "Postponed",
  CANNOT_BE_REACHED: "CannotBeReached",
  REJECTED_AND_NOT_PAID: "RejectedAndNotPaid",
  REJECTED_WITH_PARTIAL_PAYMENT: "RejectedWithPartialPayment",
  REJECTED_WITH_PAYMENT: "RejectedWithPayment",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  New: "New",
  Pending: "Pending",
  DeliveredToAgent: "Delivered To Agent",
  Delivered: "Delivered",
  CanceledByRecipient: "Canceled By Recipient",
  PartiallyDelivered: "Partially Delivered",
  Postponed: "Postponed",
  CannotBeReached: "Cannot Be Reached",
  RejectedAndNotPaid: "Rejected - Not Paid",
  RejectedWithPartialPayment: "Rejected - Partial Payment",
  RejectedWithPayment: "Rejected - With Payment",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  DeliveredToAgent: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  CanceledByRecipient: "bg-red-100 text-red-700",
  PartiallyDelivered: "bg-teal-100 text-teal-700",
  Postponed: "bg-gray-100 text-gray-700",
  CannotBeReached: "bg-orange-100 text-orange-700",
  RejectedAndNotPaid: "bg-red-200 text-red-800",
  RejectedWithPartialPayment: "bg-red-200 text-red-800",
  RejectedWithPayment: "bg-red-200 text-red-800",
};
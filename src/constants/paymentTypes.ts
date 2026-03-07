export const PAYMENT_TYPES = {
  CASH: "Cash",
  VISA: "Visa",
  VODAFONE_CASH: "Vodafone",
} as const;

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  Cash: "Cash",
  Visa: "Visa",
  Vodafone: "Vodafone Cash",
};
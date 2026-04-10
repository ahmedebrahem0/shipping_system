// OrderStatusBadge.tsx
// Displays a colored badge based on order status

import { cn } from "@/lib/utils/cn";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/orderStatuses";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const color = ORDER_STATUS_COLORS[status as OrderStatus] ?? "bg-gray-100 text-gray-700";
  const label = ORDER_STATUS_LABELS[status as OrderStatus] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        color
      )}
    >
      {label}
    </span>
  );
}
// StatusBadge.tsx
// Displays a colored badge based on order status

import { cn } from "@/lib/utils/cn";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/orderStatuses";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        ORDER_STATUS_COLORS[status]
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
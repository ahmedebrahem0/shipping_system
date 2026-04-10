// useCreateOrder.ts
// Handles order creation logic

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/store/slices/api/apiSlice";
import type { OrderCreateFormValues } from "@/features/orders/schema/order-create.schema";
import { ROUTES } from "@/constants/routes";

interface ApiErrorPayload {
  message?: string;
}

interface ApiError {
  data?: ApiErrorPayload;
}

export const useCreateOrder = () => {
  const router = useRouter();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCreate = async (values: OrderCreateFormValues) => {
    try {
      await createOrder(values).unwrap();
      toast.success("Order created successfully");
      router.push(ROUTES.ORDERS);
    } catch (error: any) {
  // كدا هيقرأ لو في Message أو لو في Error (زي ما ظهرلنا في Postman)
  const errorMessage = 
    error?.data?.message || 
    error?.data?.error || 
    "Failed to create order";

  toast.error(errorMessage);
    }
  };

  return {
    handleCreate,
    isLoading,
  };
};

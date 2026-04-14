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
      const payload = {
        merchant_Id: values.merchant_Id,
        branch_Id: values.branch_Id,
        government_Id: values.government_Id,
        city_Id: values.city_Id,
        shippingType_Id: values.shippingType_Id,
        orderType: values.orderType,
        clientName: values.clientName,
        clientPhone1: values.clientPhone1,
        clientPhone2: values.clientPhone2,
        clientEmail: values.clientEmail,
        clientAddress: values.clientAddress,
        deliverToVillage: values.deliverToVillage,
        paymentType: values.paymentType,
        orderCost: values.orderCost,
        orderTotalWeight: values.orderTotalWeight ?? 0,
        merchantNotes: values.merchantNotes ?? "",
        employeeNotes: values.employeeNotes ?? "",
        deliveryNotes: values.deliveryNotes ?? "",
        products: values.products,
      };
      await createOrder(payload).unwrap();
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

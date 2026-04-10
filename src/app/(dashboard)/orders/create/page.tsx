
// orders/create/page.tsx
// Create new order page

"use client";

import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/features/orders/hooks/useCreateOrder";
import OrderForm from "@/features/orders/components/OrderForm";
import PageHeader from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function CreateOrderPage() {
  const router = useRouter();
  const { handleCreate, isLoading } = useCreateOrder();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Create New Order"
        description="Fill in the details to create a new order"
      />

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-4xl">
        <OrderForm
          isLoading={isLoading}
          onSubmit={handleCreate}
          onCancel={() => router.push(ROUTES.ORDERS)}
        />
      </div>
    </div>
  );
}
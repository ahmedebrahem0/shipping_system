
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
      <div className="themed-surface max-w-4xl rounded-xl p-6">
        <OrderForm
          isLoading={isLoading}
          onSubmit={handleCreate}
          onCancel={() => router.push(ROUTES.ORDERS)}
        />
      </div>
    </div>
  );
}

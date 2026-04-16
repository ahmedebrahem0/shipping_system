// deliveries/create/page.tsx
// Create new delivery agent page

"use client";

import { useRouter } from "next/navigation";
import { useDeliveries } from "@/features/deliveries/hooks/useDeliveries";
import DeliveryForm from "@/features/deliveries/components/DeliveryForm";
import PageHeader from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import type { DeliveryCreateRequest } from "@/types/delivery.types";

export default function CreateDeliveryPage() {
  const router = useRouter();
  const { handleCreate, isCreating } = useDeliveries();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Add New Delivery Agent"
        description="Fill in the details to create a new delivery agent"
      />

      {/* Form */}
      <div className="themed-surface max-w-2xl rounded-xl p-6">
        <DeliveryForm
          isLoading={isCreating}
          onSubmit={(values) => handleCreate(values as DeliveryCreateRequest)}
          onCancel={() => router.push(ROUTES.DELIVERIES)}
        />
      </div>
    </div>
  );
}

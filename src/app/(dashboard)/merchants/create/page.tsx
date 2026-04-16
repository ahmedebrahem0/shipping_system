// merchants/create/page.tsx
// Create new merchant page

"use client";

import { useRouter } from "next/navigation";
import { useMerchants } from "@/features/merchants/hooks/useMerchants";
import MerchantForm from "@/features/merchants/components/MerchantForm";
import PageHeader from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function CreateMerchantPage() {
  const router = useRouter();
  const { handleCreate, isCreating } = useMerchants();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Add New Merchant"
        description="Fill in the details to create a new merchant"
      />

      {/* Form */}
      <div className="themed-surface max-w-2xl rounded-xl p-6">
        <MerchantForm
          isLoading={isCreating}
          onSubmit={handleCreate}
          onCancel={() => router.push(ROUTES.MERCHANTS)}
        />
      </div>
    </div>
  );
}

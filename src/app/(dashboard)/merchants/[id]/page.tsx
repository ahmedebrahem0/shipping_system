// merchants/[id]/page.tsx
// Merchant details and edit page

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMerchants } from "@/features/merchants/hooks/useMerchants";
import { useGetMerchantByIdQuery } from "@/store/slices/api/apiSlice";
import MerchantForm from "@/features/merchants/components/MerchantForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/utils/formatters";

export default function MerchantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data, isLoading, isError } = useGetMerchantByIdQuery(Number(id));
  const { handleUpdate, isUpdating } = useMerchants();

  const merchant = data?.data;

  const onSubmit = (values: unknown) => {
    handleUpdate(Number(id), values, merchant);
  };

  if (isLoading) return <Loader fullPage />;
  if (isError || !merchant) return <ErrorMessage />;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={isEditing ? "Edit Merchant" : merchant.name}
        description={isEditing ? "Update merchant details" : merchant.email}
      />

      {isEditing ? (
        // Edit Form
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <MerchantForm
            selectedMerchant={merchant}
            isLoading={isUpdating}
            onSubmit={onSubmit}
            onCancel={() => router.push(ROUTES.MERCHANTS)}
          />
        </div>
      ) : (
        // Details View
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Email</p>
              <p className="text-sm text-gray-900">{merchant.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Phone</p>
              <p className="text-sm text-gray-900">{merchant.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Store Name</p>
              <p className="text-sm text-gray-900">{merchant.storeName || "—"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Government</p>
              <p className="text-sm text-gray-900">{merchant.government}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">City</p>
              <p className="text-sm text-gray-900">{merchant.city}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Address</p>
              <p className="text-sm text-gray-900">{merchant.address}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Branch</p>
              <p className="text-sm text-gray-900">{merchant.branchsNames}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Pickup Cost</p>
              <p className="text-sm text-gray-900">{merchant.pickupCost} EGP</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Rejected Order %</p>
              <p className="text-sm text-gray-900">{merchant.rejectedOrderPercentage}%</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Created At</p>
              <p className="text-sm text-gray-900">{merchant.createdDate}</p>
            </div>

          </div>

          {/* Edit Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push(`${ROUTES.MERCHANT_DETAILS(Number(id))}?edit=true`)}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Edit Merchant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
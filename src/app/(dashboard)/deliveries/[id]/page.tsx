// deliveries/[id]/page.tsx
// Delivery agent details and edit page

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDeliveries } from "@/features/deliveries/hooks/useDeliveries";
import { useGetDeliveryByIdQuery } from "@/store/slices/api/apiSlice";
import DeliveryForm from "@/features/deliveries/components/DeliveryForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data, isLoading, isError } = useGetDeliveryByIdQuery(Number(id));
  const { handleUpdate, isUpdating } = useDeliveries();

  const delivery = data;

  if (isLoading) return <Loader fullPage />;
  if (isError || !delivery) return <ErrorMessage />;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={isEditing ? "Edit Delivery Agent" : delivery.name}
        description={isEditing ? "Update delivery agent details" : delivery.email}
      />

      {isEditing ? (
        // Edit Form
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <DeliveryForm
            selectedDelivery={delivery}
            isLoading={isUpdating}
            onSubmit={(values) => handleUpdate(Number(id), { ...values, isDeleted: false })}
            onCancel={() => router.push(ROUTES.DELIVERIES)}
          />
        </div>
      ) : (
        // Details View
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{delivery.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Email</p>
              <p className="text-sm text-gray-900">{delivery.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Phone</p>
              <p className="text-sm text-gray-900">{delivery.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Address</p>
              <p className="text-sm text-gray-900">{delivery.address}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Branch</p>
              <p className="text-sm text-gray-900">{delivery.branchName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Governments</p>
              <p className="text-sm text-gray-900">{delivery.governmentName.join(", ")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Discount Type</p>
              <p className="text-sm text-gray-900">{delivery.discountType}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Company Percentage</p>
              <p className="text-sm text-gray-900">{delivery.companyPercentage}%</p>
            </div>

          </div>

          {/* Edit Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push(`${ROUTES.DELIVERY_DETAILS(Number(id))}?edit=true`)}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Edit Agent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// deliveries/[id]/page.tsx
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDeliveries } from "@/features/deliveries/hooks/useDeliveries";
import { useGetDeliveryByIdQuery } from "@/store/slices/api/apiSlice";
import DeliveryForm from "@/features/deliveries/components/DeliveryForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import { User, Mail, Phone, MapPin, Landmark, Percent, Tag, ArrowLeft, Edit3 } from "lucide-react";

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data: delivery, isLoading, isError } = useGetDeliveryByIdQuery(Number(id));
  const { handleUpdate, isUpdating } = useDeliveries();

  if (isLoading) return <Loader fullPage />;
  if (isError || !delivery) return <ErrorMessage message="Could not find the delivery agent details." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Navigation & Header */}
      <button 
        onClick={() => router.push(ROUTES.DELIVERIES)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Deliveries
      </button>

      <PageHeader
        title={isEditing ? "Update Delivery Agent" : "Agent Profile"}
        description={isEditing ? `Modifying settings for ${delivery.name}` : "Comprehensive view of agent performance and details"}
      />

      {isEditing ? (
        // --- Edit Mode ---
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8">
            <DeliveryForm
              selectedDelivery={delivery}
              isLoading={isUpdating}
              onSubmit={(values) => handleUpdate(Number(id), { ...values })}
              onCancel={() => router.push(ROUTES.DELIVERY_DETAILS(Number(id)))}
            />
          </div>
        </div>
      ) : (
        // --- Details View Mode ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
          
          {/* Left Column: Quick Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{delivery.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{delivery.email}</p>
              
              <button
                onClick={() => router.push(`${ROUTES.DELIVERY_DETAILS(Number(id))}?edit=true`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>

            {/* Financial Stats Summary (Placeholder for future data) */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <p className="text-blue-100 text-xs uppercase font-bold tracking-wider mb-1">Company Take</p>
              <div className="flex items-center gap-2">
                <Percent size={24} />
                <span className="text-3xl font-bold">{delivery.companyPercentage}%</span>
              </div>
              <p className="text-blue-100 text-[10px] mt-4 opacity-80">Fixed on every successful delivery transaction.</p>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Contact & Logistics</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Active Agent</span>
              </div>
              
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <InfoItem icon={<Phone size={18} />} label="Phone Number" value={delivery.phone} />
                <InfoItem icon={<MapPin size={18} />} label="Address" value={delivery.address} />
                <InfoItem icon={<Landmark size={18} />} label="Assigned Branch" value={delivery.branchName} />
                <InfoItem icon={<Tag size={18} />} label="Discount Type" value={delivery.discountType} isBadge />
                
                {/* Multi-Governments Display */}
                <div className="col-span-full space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Covered Areas (Governments)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {delivery.governmentName.map((gov, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-primary/5 text-primary text-xs font-semibold rounded-lg border border-primary/10">
                        {gov}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

/** * Reusable Mini-Component for Info Rows 
 */
function InfoItem({ icon, label, value, isBadge = false }: { icon: any, label: string, value: string | number, isBadge?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      {isBadge ? (
        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">
          {value}
        </span>
      ) : (
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      )}
    </div>
  );
}
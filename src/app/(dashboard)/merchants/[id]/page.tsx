"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMerchants } from "@/features/merchants/hooks/useMerchants";
import { useGetMerchantByIdQuery } from "@/store/slices/api/apiSlice";
import MerchantForm from "@/features/merchants/components/MerchantForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";
import type { Merchant } from "@/types/merchant.types";
import { 
  User, Mail, Phone, Store, MapPin,
  Globe, CreditCard, Percent, Calendar, Edit3
} from "lucide-react";

// مكون صغير لعرض تفاصيل التاجر بشكل أنيق
const InfoItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="p-2 bg-primary/5 rounded-lg text-primary">
      <Icon size={18} />
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  </div>
);

export default function MerchantDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data, isLoading, isError } = useGetMerchantByIdQuery(Number(id));
  const { handleUpdate, isUpdating } = useMerchants();

  const merchant = data?.data?.merchant;

  const onSubmit = (values: any) => {
    handleUpdate(Number(id), values, merchant);
  };

  if (isLoading) return <Loader fullPage />;
  if (isError || !merchant) return <ErrorMessage />;

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title={isEditing ? "Edit Merchant" : merchant.name}
        description={isEditing ? "Update merchant profile information" : `Merchant ID: #${merchant.id}`}
      />

      <div className="mt-6">
        {isEditing ? (
          // Edit Form Wrapper
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <MerchantForm
                selectedMerchant={merchant}
                isLoading={isUpdating}
                onSubmit={onSubmit}
                onCancel={() => router.push(ROUTES.MERCHANT_DETAILS(Number(id)))}
              />
            </div>
          </div>
        ) : (
          // Details View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4">
                    {merchant.name[0]}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{merchant.name}</h2>
                  <p className="text-sm text-gray-500">{merchant.storeName}</p>

                  <div className="w-full mt-6 pt-6 border-t border-gray-100 flex flex-col gap-2">
                    <button
                      onClick={() => router.push(`${ROUTES.MERCHANT_DETAILS(Number(id))}?edit=true`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-600 transition-all shadow-md shadow-primary/20"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Info Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800">General Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem icon={User} label="Full Name" value={merchant.name} />
                  <InfoItem icon={Mail} label="Email Address" value={merchant.email} />
                  <InfoItem icon={Phone} label="Phone" value={merchant.phone} />
                  <InfoItem icon={Store} label="Store Name" value={merchant.storeName} />
                  <InfoItem icon={Globe} label="Government" value={merchant.government} />
                  <InfoItem icon={MapPin} label="City / Address" value={`${merchant.city}, ${merchant.address}`} />
                  <InfoItem icon={MapPin} label="Branch" value={merchant.branchsNames} />
                  <InfoItem icon={CreditCard} label="Pickup Cost" value={`${merchant.pickupCost} EGP`} />
                  <InfoItem icon={Percent} label="Rejected Rate" value={`${merchant.rejectedOrderPercentage}%`} />
                  <InfoItem icon={Calendar} label="Created At" value={merchant.createdDate} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
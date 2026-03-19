// pricing/page.tsx
// Weight pricing settings page

import WeightPricingForm from "@/features/settings/pricing/components/WeightPricingForm";
import PageHeader from "@/components/common/PageHeader";

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Weight Pricing"
        description="Set the default weight and additional kg price for shipping"
      />

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
        <WeightPricingForm />
      </div>
    </div>
  );
}
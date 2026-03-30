// settings/page.tsx
// General settings page

import SettingsForm from "@/features/settings/general/components/SettingsForm";
import PageHeader from "@/components/common/PageHeader";

export default function SettingsPage() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="General Settings"
        description="Manage your system general settings"
      />

      {/* Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md">
        <SettingsForm />
      </div>
    </div>
  );
}
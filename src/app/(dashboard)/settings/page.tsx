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
      <div className="themed-surface max-w-md rounded-xl p-6">
        <SettingsForm />
      </div>
    </div>
  );
}

// profile/page.tsx
// User profile page

import ProfileForm from "@/features/profile/components/ProfileForm";
import PageHeader from "@/components/common/PageHeader";

export default function ProfilePage() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        title="My Profile"
        description="View and manage your profile information"
      />

      {/* Content */}
      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  );
}
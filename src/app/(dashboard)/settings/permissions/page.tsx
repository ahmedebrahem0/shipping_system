// permissions/page.tsx
// Permissions management page

"use client";

import { useGetPermissionsQuery } from "@/store/slices/api/apiSlice";
import PermissionTable from "@/features/settings/permissions/components/PermissionTable";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function PermissionsPage() {
  const { data: permissions, isLoading, isError } = useGetPermissionsQuery();

  const activePermissions = permissions?.filter((p) => !p.isDeleted) ?? [];

  return (
    <div>
      <PageHeader
        title="Permissions"
        description="View all system permissions"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorMessage />
        ) : activePermissions.length === 0 ? (
          <EmptyState
            title="No permissions found"
            description="There are no permissions in the system."
          />
        ) : (
          <PermissionTable permissions={activePermissions} />
        )}
      </div>
    </div>
  );
}

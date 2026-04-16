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
    <div className="space-y-6">
      {/* Header */}
      <div className="themed-surface rounded-3xl p-6">
        <PageHeader
          title="Permissions"
          description="View all system permissions"
        />
      </div>

      {/* Content */}
      <div className="themed-surface overflow-hidden rounded-3xl">
        <div className="themed-surface-header px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Permissions List
            </h2>
            <div className="themed-surface rounded-full px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              Total: {activePermissions.length}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : isError ? (
          <div className="p-8">
            <ErrorMessage />
          </div>
        ) : activePermissions.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No permissions found"
              description="There are no permissions in the system."
            />
          </div>
        ) : (
          <div className="px-2 py-2">
            <PermissionTable permissions={activePermissions} />
          </div>
        )}
      </div>
    </div>
  );
}

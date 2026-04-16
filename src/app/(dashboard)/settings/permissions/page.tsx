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
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <PageHeader
          title="Permissions"
          description="View all system permissions"
        />
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Permissions List
            </h2>
            <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
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
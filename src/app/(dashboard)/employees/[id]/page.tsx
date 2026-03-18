// employees/[id]/page.tsx
// Employee details and edit page

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useGetEmployeeByIdQuery } from "@/store/slices/api/apiSlice";
import EmployeeForm from "@/features/employees/components/EmployeeForm";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ROUTES } from "@/constants/routes";

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data, isLoading, isError } = useGetEmployeeByIdQuery(Number(id));
  const { handleUpdate, isUpdating } = useEmployees();

  const employee = data;

  if (isLoading) return <Loader fullPage />;
  if (isError || !employee) return <ErrorMessage />;

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Employee" : employee.name}
        description={isEditing ? "Update employee details" : employee.email ?? ""}
      />

      {isEditing ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <EmployeeForm
            selectedEmployee={employee}
            isLoading={isUpdating}
            onSubmit={(values) => handleUpdate(Number(id), values)}
            onCancel={() => router.push(ROUTES.EMPLOYEES)}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{employee.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Email</p>
              <p className="text-sm text-gray-900">{employee.email ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Phone</p>
              <p className="text-sm text-gray-900">{employee.phone ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Address</p>
              <p className="text-sm text-gray-900">{employee.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Branch</p>
              <p className="text-sm text-gray-900">{employee.branchId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                employee.isDeleted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}>
                {employee.isDeleted ? "Inactive" : "Active"}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push(`${ROUTES.EMPLOYEE_DETAILS(Number(id))}?edit=true`)}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Edit Employee
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
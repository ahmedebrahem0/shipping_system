// employees/create/page.tsx
// Create new employee page

"use client";

import { useRouter } from "next/navigation";
import { useEmployees } from "@/features/employees/hooks/useEmployees";
import EmployeeForm from "@/features/employees/components/EmployeeForm";
import PageHeader from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { handleCreate, isCreating } = useEmployees();

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Add New Employee"
        description="Fill in the details to create a new employee"
      />

      {/* Form */}
      <div className="themed-surface max-w-2xl rounded-xl p-6">
        <EmployeeForm
          isLoading={isCreating}
          onSubmit={handleCreate}
          onCancel={() => router.push(ROUTES.EMPLOYEES)}
        />
      </div>
    </div>
  );
}

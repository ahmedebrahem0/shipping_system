// EmployeeForm.tsx
// Form for creating and editing an employee

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  employeeCreateSchema,
  employeeEditSchema,
  type EmployeeCreateFormValues,
  type EmployeeEditFormValues,
} from "@/features/employees/schema/employee.schema";
import { useGetBranchesQuery } from "@/store/slices/api/apiSlice";
import PasswordInput from "@/components/common/PasswordInput";
import { ROLES } from "@/constants/roles";
import type { Employee } from "@/types/employee.types";

interface EmployeeFormProps {
  selectedEmployee?: Employee | null;
  isLoading: boolean;
  onSubmit: (values: EmployeeCreateFormValues | EmployeeEditFormValues) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  selectedEmployee,
  isLoading,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const isEditing = !!selectedEmployee;

  const { data: branchesData } = useGetBranchesQuery({ pageSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeCreateFormValues | EmployeeEditFormValues>({
    resolver: yupResolver(
      isEditing ? employeeEditSchema : employeeCreateSchema
    ) as never,
  });

  useEffect(() => {
    if (selectedEmployee) {
      reset({
        name: selectedEmployee.name,
        email: selectedEmployee.email ?? "",
        password: "",
        confirmPassword: "",
        phone: selectedEmployee.phone ?? "",
        address: selectedEmployee.address,
        role: ROLES.EMPLOYEE,
        branchId: selectedEmployee.branchId,
      });
    } else {
      reset({});
    }
  }, [selectedEmployee, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          {...register("name")}
          placeholder="Enter employee name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <PasswordInput
          {...register("password")}
          placeholder="Enter password"
          error={errors.password?.message}
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <PasswordInput
          {...register("confirmPassword")}
          placeholder="Confirm password"
          error={errors.confirmPassword?.message}
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <input
          {...register("address")}
          placeholder="Enter address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500"
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      {/* Role */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <select
          {...register("role")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
        >
          <option value="">Select a role</option>
          {Object.values(ROLES).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
      </div>

      {/* Branch */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Branch <span className="text-gray-400">(optional)</span>
        </label>
        <select
          {...register("branchId")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary-500 bg-white"
        >
          <option value={0}>Select a branch</option>
          {branchesData?.data?.branches?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        {errors.branchId && <p className="text-xs text-red-500">{errors.branchId.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
      </div>

    </form>
  );
}
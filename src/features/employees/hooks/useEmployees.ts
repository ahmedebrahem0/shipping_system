// useEmployees.ts
// Handles all employee operations - fetch, create, update, delete

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSearchEmployeesQuery,
} from "@/store/slices/api/apiSlice";
import type { EmployeeCreateFormValues, EmployeeEditFormValues } from "@/features/employees/schema/employee.schema";
import type { Employee } from "@/types/employee.types";
import { ROUTES } from "@/constants/routes";

export const useEmployees = () => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

const { data: searchResults, isLoading: isSearching } = useSearchEmployeesQuery(
  searchTerm,
  { skip: searchTerm.length < 2 }

);

  // ==================== Fetch ====================
  const { data, isLoading, isError } = useGetEmployeesQuery({
    pageIndex,
    pageSize: 10,
  });

  // ==================== Create ====================
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();

  const handleCreate = async (values: EmployeeCreateFormValues) => {
    try {
      await createEmployee(values).unwrap();
      toast.success("Employee created successfully");
      router.push(ROUTES.EMPLOYEES);
    } catch {
      toast.error("Failed to create employee");
    }
  };

  // ==================== Update ====================
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();

  const handleUpdate = async (id: number, values: EmployeeEditFormValues) => {
    try {
      await updateEmployee({ id, data: values }).unwrap();
      toast.success("Employee updated successfully");
      router.push(ROUTES.EMPLOYEES);
    } catch {
      toast.error("Failed to update employee");
    }
  };

  // ==================== Delete ====================
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee(selectedEmployee.id).unwrap();
      toast.success("Employee deleted successfully");
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  // ==================== Helpers ====================
  const openDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  return {
    // Data (filter out soft-deleted items)
    employees: data?.items?.filter((emp) => !emp.isDeleted) ?? [],
    totalCount: data?.totalCount ?? 0,
    pageIndex,
    isLoading,
    isError,

    // Pagination
    setPageIndex,

    // Delete Dialog
    isDeleteOpen,
    setIsDeleteOpen,
    selectedEmployee,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    openDelete,

    // Loading States
    isCreating,
    isUpdating,
    isDeleting,

    //search
    searchTerm,
    setSearchTerm,
    searchResults: searchResults ?? [],
    isSearching,
  };
};
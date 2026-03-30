// useRoles.ts
// Handles roles and permissions operations

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreateRolePermissionMutation,
  useUpdateRolePermissionMutation,
} from "@/store/slices/api/apiSlice";
import type { Role, Permission, UpdateRolePermissionRequest } from "@/types/role.types";

export const useRoles = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ==================== Fetch ====================
  const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery({
    includeDelted: false,
  });

  const { data: permissions, isLoading: isLoadingPermissions } = useGetPermissionsQuery();

  // ==================== Create Role ====================
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  const handleCreateRole = async (name: string) => {
    try {
      await createRole({ name }).unwrap();
      toast.success("Role created successfully");
      setIsFormOpen(false);
    } catch {
      toast.error("Failed to create role");
    }
  };

  // ==================== Update Role ====================
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const handleUpdateRole = async (name: string) => {
    if (!selectedRole) return;
    try {
      await updateRole({ id: selectedRole.id, data: { name } }).unwrap();
      toast.success("Role updated successfully");
      setIsFormOpen(false);
      setSelectedRole(null);
    } catch {
      toast.error("Failed to update role");
    }
  };

  // ==================== Delete Role ====================
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    try {
      await deleteRole(selectedRole.id).unwrap();
      toast.success("Role deleted successfully");
      setIsDeleteOpen(false);
      setSelectedRole(null);
    } catch {
      toast.error("Failed to delete role");
    }
  };

  // ==================== Update Role Permission ====================
  const [createRolePermission] = useCreateRolePermissionMutation();
  const [updateRolePermission] = useUpdateRolePermissionMutation();

  const handleUpdatePermission = async (
    permissionId: number,
    data: UpdateRolePermissionRequest,
    isExisting: boolean
  ) => {
    if (!selectedRole) return;
    try {
      if (isExisting) {
        await updateRolePermission({
          roleId: selectedRole.id,
          permissionId,
          data,
        }).unwrap();
      } else {
        await createRolePermission({
          roleId: selectedRole.id,
          permissionId,
          data: { ...data, permission_Id: permissionId, role_Id: selectedRole.id },
        }).unwrap();
      }
      toast.success("Permission updated successfully");
    } catch {
      toast.error("Failed to update permission");
    }
  };

  // ==================== Helpers ====================
  const openCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const openDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const activePermissions = permissions?.filter((p) => !p.isDeleted) ?? [];

  return {
    // Data
    roles: roles?.filter((r) => !r.isDeleted) ?? [],
    permissions: activePermissions,
    selectedRole,
    setSelectedRole,
    isLoadingRoles,
    isLoadingPermissions,

    // Form
    isFormOpen,
    setIsFormOpen,

    // Delete
    isDeleteOpen,
    setIsDeleteOpen,

    // Actions
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleUpdatePermission,
    openCreate,
    openEdit,
    openDelete,

    // Loading
    isCreating,
    isUpdating,
    isDeleting,
  };
};
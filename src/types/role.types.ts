// role.types.ts
// Types for roles and permissions API requests and responses

// ==================== Role Permission Types ====================

export interface RolePermission {
  permission_Id: number;
  role_Id: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
  isDeleted: boolean;
}

// ==================== Role Types ====================

export interface Role {
  id: string;
  name: string;
  isDeleted: boolean;
  rolePermissions: RolePermission[];
}

// ==================== Permission Types ====================

export interface Permission {
  id: number;
  name: string;
  isDeleted: boolean;
}

// ==================== Request Types ====================

export interface CreateRoleRequest {
  name: string;
}

export interface UpdateRoleRequest {
  name: string;
}

export interface CreateRolePermissionRequest {
  permission_Id: number;
  role_Id: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
}

export interface UpdateRolePermissionRequest {
  role_Id: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
}
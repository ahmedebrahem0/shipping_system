// employee.types.ts
// Types for employee API requests and responses

// ==================== Response Types ====================

export interface Employee {
  id: number;
  isDeleted: boolean;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  branchId: number;
}

export interface EmployeesData {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  items: Employee[];
}

// ==================== Request Types ====================

export interface EmployeeCreateRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: string;
  branchId?: number;
}

export interface EmployeeEditRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role: string;
  branchId?: number;
}
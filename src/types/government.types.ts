// government.types.ts
// Types for government API requests and responses

// ==================== Response Types ====================

export interface Government {
  id: number;
  name: string;
  isDeleted: boolean;
  branch_Id: number;
}

export interface GovernmentsData {
  totalGovernments: number;
  page: number;
  pageSize: number;
  governments: Government[];
}

// ==================== Request Types ====================

export interface GovernmentCreateRequest {
  name: string;
  branch_Id: number;
}

export interface GovernmentEditRequest {
  name: string;
  isDeleted: boolean;
  branch_Id: number;
}
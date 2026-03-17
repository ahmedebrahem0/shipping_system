// branch.types.ts
// Types for branch API requests and responses

// ==================== Response Types ====================

export interface Branch {
  id: number;
  name: string;
  mobile: string;
  location: string;
  createdDate: string;
  isDeleted: boolean;
}

export interface BranchesData {
  totalBranches: number;
  page: number;
  pageSize: number;
  branches: Branch[];
}

// ==================== Request Types ====================

export interface BranchCreateRequest {
  name: string;
  mobile: string;
  location: string;
}

export interface BranchEditRequest {
  name: string;
  mobile: string;
  location: string;
  isDeleted: boolean;
}
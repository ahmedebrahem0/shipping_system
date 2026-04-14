// delivery.types.ts
// Types for delivery API requests and responses

// ==================== Response Types ====================

export interface Delivery {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  branchId?: number;
  governmentsId?: number[];
  branchName: string;
  governmentName: string[];
  discountType: string;
  companyPercentage: number;
  isDeleted: boolean;
}

// ==================== Request Types ====================

export interface DeliveryCreateRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  branchId: number;
  governmentsId: number[];
  discountType: string;
  companyPercentage: number;
}

export interface DeliveryEditRequest
  extends Omit<DeliveryCreateRequest, "password"> {
  password?: string;
  isDeleted?: boolean;
}

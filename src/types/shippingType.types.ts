// shippingType.types.ts
// Types for shipping type API requests and responses

// ==================== Response Types ====================

export interface ShippingType {
  id: number;
  type: string;
  description: string;
  cost: number;
  isDeleted: boolean;
}

// ==================== Request Types ====================

export interface ShippingTypeCreateRequest {
  type: string;
  description?: string;
  cost: number;
}

export interface ShippingTypeEditRequest {
  id: number;
  type: string;
  description?: string;
  cost: number;
  isDeleted: boolean;
}
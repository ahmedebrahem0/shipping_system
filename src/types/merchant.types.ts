// merchant.types.ts
// Types for merchant API requests and responses

import type { ApiResponse } from "./api.types";

// ==================== Response Types ====================

export interface Merchant {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  storeName: string;
  isDeleted: boolean;
  government: string;
  city: string;
  pickupCost: number;
  rejectedOrderPercentage: number;
  branchsNames: string;
}

export interface MerchantsData {
  totalMerchants: number;
  page: number;
  pageSize: number;
  merchants: Merchant[];
}

export type MerchantsResponse = ApiResponse<MerchantsData>;

// ==================== Request Types ====================

export interface SpecialShippingRate {
  city_Id: number;
  specialPrice: number;
}

export interface MerchantCreateRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  storeName?: string;
  government: string;
  city: string;
  pickupCost: number;
  rejectedOrderPercentage?: number;
  specialShippingRates?: SpecialShippingRate[];
  branches_Id?: number[];
}

export interface MerchantEditRequest {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  phone: string;
  address: string;
  storeName?: string;
  government: string;
  city: string;
  pickupCost: number;
  rejectedOrderPercentage?: number;
  isDeleted?: boolean;
  specialShippingRates?: SpecialShippingRate[];
  branches_Id?: number[];
}
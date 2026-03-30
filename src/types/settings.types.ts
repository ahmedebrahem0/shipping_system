// settings.types.ts
// Types for general settings API requests and responses

import type { ApiResponse } from "./api.types";

// ==================== Response Types ====================

export interface Setting {
  id: number;
  shippingToVillageCost: number;
  deliveryAutoAccept: boolean;
  isDeleted: boolean;
}

export type SettingsResponse = ApiResponse<Setting[]>;

// ==================== Request Types ====================

export interface SettingCreateRequest {
  shippingToVillageCost: number;
  deliveryAutoAccept: boolean;
}

export interface SettingEditRequest {
  shippingToVillageCost: number;
  deliveryAutoAccept: boolean;
}
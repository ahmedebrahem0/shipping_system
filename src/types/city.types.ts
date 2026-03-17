// city.types.ts
// Types for city API requests and responses

import type { ApiResponse } from "./api.types";

// ==================== Response Types ====================

export interface City {
  id: number;
  name: string;
  governmentName: string;
  isDeleted: boolean;
  pickupShipping: number | null;
  standardShipping: number;
}

export interface CitiesData {
  totalCitiess: number;
  page: number;
  pageSize: number;
  cities: City[];
}

export type CitiesResponse = ApiResponse<CitiesData>;

// ==================== Request Types ====================

export interface CityCreateRequest {
  government_Id: number;
  name: string;
  pickupShipping?: number;
  standardShipping?: number;
}

export interface CityEditRequest extends CityCreateRequest {
  isDeleted: boolean;
}
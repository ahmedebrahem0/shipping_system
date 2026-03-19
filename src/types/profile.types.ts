// profile.types.ts
// Types for profile API requests and responses

import type { ApiResponse } from "./api.types";

// ==================== Response Types ====================

export interface Profile {
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  roles: string[];
  createdDate: string;
  profileImagePath: string;
}

export type ProfileResponse = ApiResponse<Profile>;

// ==================== Request Types ====================

export interface UploadProfileImageRequest {
  imageFile: File;
}
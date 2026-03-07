import type { Role } from "@/constants/roles";

// اللي بنبعته للسيرفر
export interface LoginRequest {
  email: string;
  password: string;
}

// اللي بييجي من السيرفر (التوكن نفسه)
export interface LoginResponse {
  token: string;
}

// اللي جوه التوكن بعد ما نفكه
export interface DecodedToken {
  email: string;
  nameid: string;      // user id
  unique_name: string; // user name
  role: Role;
  exp: number;         // expiry time
}

// اللي بنخزنه في الـ Redux
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
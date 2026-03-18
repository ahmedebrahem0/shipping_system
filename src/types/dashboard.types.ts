// dashboard.types.ts
// Types for dashboard statistics

export interface DashboardStats {
  totalOrders: number;
  totalMerchants: number;
  totalDeliveries: number;
  totalBranches: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message?: string;
  data: DashboardStats;
}

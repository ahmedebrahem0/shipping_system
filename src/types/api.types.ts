
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  data: T;
  message: string | null;
  error: string | null;
}


export interface PaginationParams {
  page?: number;
  pageSize?: number;
  searchTxt?: string;
}
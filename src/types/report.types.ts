export interface OrderReport {
  serialNumber: string;
  orderStatus: string;
  merchantName: string;
  clientName: string;
  clientPhone: string;
  governrate: string;
  city: string;
  orderCost: number;
  shippingCost: number;
  createdDate: string;
  companyRights?: string | null;
}

export interface OrderReportFilters {
  merchantId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  searchTxt?: string;
  page?: number;
  pageSize?: number;
  orderStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderReportResponse {
  data: {
    orders: OrderReport[];
    totalOrders: number;
    page: number;
    pageSize: number;
  };
}
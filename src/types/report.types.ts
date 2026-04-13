export interface OrderReport {
  id: number;
  orderNumber: string;
  merchantName: string;
  clientName: string;
  clientPhone: string;
  address: string;
  productName: string;
  productPrice: number;
  shippingCost: number;
  totalCost: number;
  orderStatus: string;
  paymentType: string;
  createdDate: string;
}

export interface OrderReportFilters {
  merchantId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface OrderReportResponse {
  orders: OrderReport[];
  totalCount: number;
  page: number;
  pageSize: number;
}
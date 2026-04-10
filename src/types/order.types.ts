// order.types.ts
// Types for order API requests and responses

import type { ApiResponse } from "./api.types";
import type { OrderStatus } from "@/constants/orderStatuses";
import type { OrderType, PaymentType } from "@/constants/shippingTypes";

// ==================== Product Types ====================

export interface ProductRequest {
  name: string;
  quantity: number;
  itemWeight: number;
  orderId: number;
}

export interface ProductCreateRequest {
  name: string;
  quantity: number;
  itemWeight: number;
}

export interface Product {
  id: number;
  orderId: number;
  name: string;
  quantity: number;
  itemWeight: number;
  isDeleted: boolean;
}

// ==================== Order List Item (from GET all) ====================

export interface OrderListItem {
  id: number;
  serialNumber: string;
  createdDate: string;
  clientData: string; // "name\nphone1\nphone2"
  governrate: string;
  city: string;
  orderCost: number;
}

export interface OrdersData {
  totalOrders: number;
  page: number;
  pageSize: number;
  orders: OrderListItem[];
}

export type OrdersResponse = ApiResponse<OrdersData>;

// ==================== Order Details (from GET by id) ====================

export interface OrderDetails {
  id: number;
  serialNumber: string;
  createdDate: string;
  clientName: string;
  clientPhone1: string;
  clientPhone2?: string;
  clientEmail?: string;
  clientAddress: string;
  governrate: string;
  city: string;
  merchantName: string;
  branchName: string;
  shippingType: string;
  deliveryName?: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentType: PaymentType;
  orderCost: number;
  shippingCost: number;
  deliveryRight?: number;
  companyRight?: number;
  orderTotalWeight: number;
  deliverToVillage: boolean;
  merchantNotes?: string;
  employeeNotes?: string;
  deliveryNotes?: string;
  products: Product[];
}

export type OrderDetailsResponse = ApiResponse<OrderDetails>;

// ==================== Request Types ====================

export interface OrderCreateRequest {
  merchant_Id: number;
  branch_Id: number;
  government_Id: number;
  shippingType_Id: number;
  city_Id: number;
  orderType: string;
  clientName: string;
  clientPhone1: string;
  clientPhone2?: string;
  clientEmail?: string;
  clientAddress: string;
  deliverToVillage: boolean;
  paymentType: string;
  orderCost: number;
  orderTotalWeight?: number;
  merchantNotes?: string;
  employeeNotes?: string;
  deliveryNotes?: string;
  products: Product[];
}

export type OrderEditRequest = OrderCreateRequest;

// ==================== Filters ====================

export interface OrderFilters {
  page?: number;
  pageSize?: number;
  searchTxt?: string;
  branchId?: number;
  merchantId?: number;
  governId?: number;
  cityId?: number;
  deliveryId?: number;
  serialNum?: string;
  startDate?: string;
  endDate?: string;
}
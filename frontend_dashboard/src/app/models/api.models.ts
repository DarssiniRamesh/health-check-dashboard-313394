/**
 * Shared TypeScript models matching backend DTOs.
 * These models align with the OpenAPI spec from backend_api.
 */

// User models
export interface UserDto {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// Customer models
export interface CustomerDto {
  id: number;
  name: string;
  email: string;
  address?: string;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  address?: string;
}

// Billing Category models
export interface BillingCategoryDto {
  id: number;
  name: string;
  description?: string;
  hourlyRate: number;
  totalHours?: number;
  totalRevenue?: number;
}

export interface CreateBillingCategoryRequest {
  name: string;
  description?: string;
  hourlyRate: number;
}

export interface UpdateCategoryRateRequest {
  newRate: number;
}

// Billable Hours models
export interface BillableHourViewDto {
  id: number;
  dateLogged: string;
  customerId: number;
  customerName: string;
  userId: number;
  userName: string;
  categoryId: number;
  categoryName: string;
  hours: number;
  hourlyRate: number;
  lineTotal: number;
  note?: string;
  createdAt: string;
}

export interface CreateBillableHourRequest {
  customerId: number;
  userId: number;
  categoryId: number;
  hours: number;
  note?: string;
  date?: string; // ISO date format
}

// Dashboard models
export interface DashboardSummaryDto {
  totalCustomers: number;
  totalUsers: number;
  totalRevenue: number;
}

// Report models
export interface CustomerBillLineItemDto {
  dateLogged: string;
  userName: string;
  categoryName: string;
  hours: number;
  hourlyRate: number;
  lineTotal: number;
  note?: string;
}

export interface CustomerBillReportDto {
  customerId: number;
  customerName: string;
  lineItems: CustomerBillLineItemDto[];
  totalHours: number;
  totalAmount: number;
}

export interface MonthlyCustomerSummaryRowDto {
  customerName: string;
  totalHours: number;
  totalAmount: number;
}

export interface MonthlyReportDto {
  year: number;
  month: number;
  rows: MonthlyCustomerSummaryRowDto[];
}

export interface RevenueByCustomerRowDto {
  customerId: number;
  customerName: string;
  totalHours: number;
  totalRevenue: number;
  avgRate: number;
}

export interface RevenueByCategoryRowDto {
  categoryId: number;
  categoryName: string;
  hourlyRate: number;
  totalHours: number;
  totalRevenue: number;
}

export interface RevenueSummaryDto {
  byCustomer: RevenueByCustomerRowDto[];
  byCategory: RevenueByCategoryRowDto[];
}

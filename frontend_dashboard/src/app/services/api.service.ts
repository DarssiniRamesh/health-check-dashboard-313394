import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  UserDto,
  CreateUserRequest,
  CustomerDto,
  CreateCustomerRequest,
  BillingCategoryDto,
  CreateBillingCategoryRequest,
  UpdateCategoryRateRequest,
  BillableHourViewDto,
  CreateBillableHourRequest,
  DashboardSummaryDto,
  CustomerBillReportDto,
  MonthlyReportDto,
  RevenueSummaryDto,
} from '../models/api.models';

/**
 * Centralized API service for all backend endpoints.
 * Provides methods for users, customers, categories, hours, dashboard, and reports.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = (
    environment.apiBaseUrl ??
    environment.BACKEND_API_URL ??
    'http://localhost:3002'
  ).replace(/\/$/, '');

  // === User endpoints ===

  // PUBLIC_INTERFACE
  /**
   * List all users.
   * GET /api/users
   */
  listUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/api/users`);
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new user.
   * POST /api/users
   */
  createUser(request: CreateUserRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.baseUrl}/api/users`, request);
  }

  // === Customer endpoints ===

  // PUBLIC_INTERFACE
  /**
   * List all customers.
   * GET /api/customers
   */
  listCustomers(): Observable<CustomerDto[]> {
    return this.http.get<CustomerDto[]>(`${this.baseUrl}/api/customers`);
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new customer.
   * POST /api/customers
   */
  createCustomer(request: CreateCustomerRequest): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(`${this.baseUrl}/api/customers`, request);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a customer by ID.
   * DELETE /api/customers/{id}
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/customers/${id}`);
  }

  // === Billing Category endpoints ===

  // PUBLIC_INTERFACE
  /**
   * List all billing categories with aggregate totals.
   * GET /api/categories
   */
  listCategories(): Observable<BillingCategoryDto[]> {
    return this.http.get<BillingCategoryDto[]>(`${this.baseUrl}/api/categories`);
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new billing category.
   * POST /api/categories
   */
  createCategory(request: CreateBillingCategoryRequest): Observable<BillingCategoryDto> {
    return this.http.post<BillingCategoryDto>(`${this.baseUrl}/api/categories`, request);
  }

  // PUBLIC_INTERFACE
  /**
   * Update the hourly rate for a billing category.
   * PATCH /api/categories/{id}/rate
   */
  updateCategoryRate(id: number, request: UpdateCategoryRateRequest): Observable<BillingCategoryDto> {
    return this.http.patch<BillingCategoryDto>(`${this.baseUrl}/api/categories/${id}/rate`, request);
  }

  // === Billable Hours endpoints ===

  // PUBLIC_INTERFACE
  /**
   * List recent billable hours (default limit 20).
   * GET /api/hours
   */
  listRecentHours(limit: number = 20): Observable<BillableHourViewDto[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<BillableHourViewDto[]>(`${this.baseUrl}/api/hours`, { params });
  }

  // PUBLIC_INTERFACE
  /**
   * Log a new billable hour entry.
   * POST /api/hours
   */
  logBillableHour(request: CreateBillableHourRequest): Observable<BillableHourViewDto> {
    return this.http.post<BillableHourViewDto>(`${this.baseUrl}/api/hours`, request);
  }

  // === Dashboard endpoints ===

  // PUBLIC_INTERFACE
  /**
   * Get dashboard summary metrics (total customers, users, revenue).
   * GET /api/dashboard
   */
  getDashboardSummary(): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`${this.baseUrl}/api/dashboard`);
  }

  // === Report endpoints ===

  // PUBLIC_INTERFACE
  /**
   * Generate a customer bill report with line items.
   * GET /api/reports/customer/{customerId}
   */
  getCustomerBillReport(customerId: number): Observable<CustomerBillReportDto> {
    return this.http.get<CustomerBillReportDto>(`${this.baseUrl}/api/reports/customer/${customerId}`);
  }

  // PUBLIC_INTERFACE
  /**
   * Generate a monthly report for a specific year and month.
   * GET /api/reports/monthly
   */
  getMonthlyReport(year: number, month: number): Observable<MonthlyReportDto> {
    const params = new HttpParams().set('year', year.toString()).set('month', month.toString());
    return this.http.get<MonthlyReportDto>(`${this.baseUrl}/api/reports/monthly`, { params });
  }

  // PUBLIC_INTERFACE
  /**
   * Get revenue summary by customer and by category.
   * GET /api/reports/revenue
   */
  getRevenueSummary(): Observable<RevenueSummaryDto> {
    return this.http.get<RevenueSummaryDto>(`${this.baseUrl}/api/reports/revenue`);
  }
}

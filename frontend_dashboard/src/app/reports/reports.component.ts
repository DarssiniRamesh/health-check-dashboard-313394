import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type {
  CustomerDto,
  CustomerBillReportDto,
  MonthlyReportDto,
  RevenueSummaryDto,
} from '../models/api.models';

type ReportType = 'customer' | 'monthly' | 'revenue';

/**
 * Reports component for generating customer bills, monthly reports, and revenue summaries.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  private readonly apiService = inject(ApiService);

  activeReport = signal<ReportType | null>(null);
  customers = signal<CustomerDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Customer bill report
  selectedCustomerId = signal<number>(0);
  customerBillReport = signal<CustomerBillReportDto | null>(null);

  // Monthly report
  selectedYear = signal<number>(new Date().getFullYear());
  selectedMonth = signal<number>(new Date().getMonth() + 1);
  monthlyReport = signal<MonthlyReportDto | null>(null);

  // Revenue summary
  revenueSummary = signal<RevenueSummaryDto | null>(null);

  // PUBLIC_INTERFACE
  /**
   * Select a report type to display.
   */
  selectReport(type: ReportType): void {
    this.activeReport.set(type);
    this.error.set(null);

    if (type === 'customer' && this.customers().length === 0) {
      this.loadCustomers();
    } else if (type === 'revenue') {
      this.loadRevenueSummary();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Load customers for customer bill report dropdown.
   */
  loadCustomers(): void {
    this.apiService.listCustomers().subscribe({
      next: (data) => this.customers.set(data),
      error: (err) => this.error.set(err.message || 'Failed to load customers'),
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Generate customer bill report.
   */
  generateCustomerBill(): void {
    if (this.selectedCustomerId() === 0) {
      this.error.set('Please select a customer');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.apiService.getCustomerBillReport(this.selectedCustomerId()).subscribe({
      next: (data) => {
        this.customerBillReport.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate customer bill');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Generate monthly report.
   */
  generateMonthlyReport(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getMonthlyReport(this.selectedYear(), this.selectedMonth()).subscribe({
      next: (data) => {
        this.monthlyReport.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to generate monthly report');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Load revenue summary.
   */
  loadRevenueSummary(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getRevenueSummary().subscribe({
      next: (data) => {
        this.revenueSummary.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load revenue summary');
        this.loading.set(false);
      },
    });
  }
}

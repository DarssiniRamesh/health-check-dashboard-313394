import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type {
  BillableHourViewDto,
  CreateBillableHourRequest,
  UserDto,
  CustomerDto,
  BillingCategoryDto,
} from '../models/api.models';

/**
 * Billable Hours component for logging and viewing billable hours.
 */
@Component({
  selector: 'app-hours',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hours.component.html',
  styleUrl: './hours.component.css',
})
export class HoursComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  hours = signal<BillableHourViewDto[]>([]);
  users = signal<UserDto[]>([]);
  customers = signal<CustomerDto[]>([]);
  categories = signal<BillingCategoryDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showLogForm = signal<boolean>(false);
  logging = signal<boolean>(false);

  newHour: CreateBillableHourRequest = {
    customerId: 0,
    userId: 0,
    categoryId: 0,
    hours: 0,
    note: '',
    date: new Date().toISOString().split('T')[0],
  };

  ngOnInit(): void {
    this.loadHours();
    this.loadDropdownData();
  }

  // PUBLIC_INTERFACE
  /**
   * Load recent billable hours from the backend.
   */
  loadHours(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.listRecentHours(50).subscribe({
      next: (data) => {
        this.hours.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load billable hours');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Load dropdown data (users, customers, categories) for the form.
   */
  loadDropdownData(): void {
    this.apiService.listUsers().subscribe({
      next: (data) => this.users.set(data),
      error: () => {},
    });

    this.apiService.listCustomers().subscribe({
      next: (data) => this.customers.set(data),
      error: () => {},
    });

    this.apiService.listCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: () => {},
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle the log hours form visibility.
   */
  toggleLogForm(): void {
    this.showLogForm.update((v) => !v);
    if (!this.showLogForm()) {
      this.resetForm();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Log a new billable hour entry.
   */
  logHour(): void {
    if (
      this.newHour.customerId === 0 ||
      this.newHour.userId === 0 ||
      this.newHour.categoryId === 0 ||
      this.newHour.hours <= 0
    ) {
      this.error.set('Please fill all required fields with valid values');
      return;
    }

    this.logging.set(true);
    this.error.set(null);

    this.apiService.logBillableHour(this.newHour).subscribe({
      next: (created) => {
        this.hours.update((list) => [created, ...list]);
        this.resetForm();
        this.showLogForm.set(false);
        this.logging.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to log billable hour');
        this.logging.set(false);
      },
    });
  }

  private resetForm(): void {
    this.newHour = {
      customerId: 0,
      userId: 0,
      categoryId: 0,
      hours: 0,
      note: '',
      date: new Date().toISOString().split('T')[0],
    };
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type { BillingCategoryDto, CreateBillingCategoryRequest, UpdateCategoryRateRequest } from '../models/api.models';

/**
 * Billing Categories component for creating and managing billing categories.
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  categories = signal<BillingCategoryDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showCreateForm = signal<boolean>(false);
  creating = signal<boolean>(false);
  editingRateId = signal<number | null>(null);
  updatingRate = signal<boolean>(false);

  newCategory: CreateBillingCategoryRequest = {
    name: '',
    description: '',
    hourlyRate: 0,
  };

  newRate: number = 0;

  ngOnInit(): void {
    this.loadCategories();
  }

  // PUBLIC_INTERFACE
  /**
   * Load all billing categories from the backend.
   */
  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.listCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load categories');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle the create category form visibility.
   */
  toggleCreateForm(): void {
    this.showCreateForm.update((v) => !v);
    if (!this.showCreateForm()) {
      this.resetForm();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new billing category.
   */
  createCategory(): void {
    if (!this.newCategory.name.trim() || this.newCategory.hourlyRate <= 0) {
      this.error.set('Name and valid hourly rate are required');
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    this.apiService.createCategory(this.newCategory).subscribe({
      next: (created) => {
        this.categories.update((list) => [...list, created]);
        this.resetForm();
        this.showCreateForm.set(false);
        this.creating.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to create category');
        this.creating.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Start editing the rate for a category.
   */
  startEditRate(category: BillingCategoryDto): void {
    this.editingRateId.set(category.id);
    this.newRate = category.hourlyRate;
  }

  // PUBLIC_INTERFACE
  /**
   * Cancel editing the rate.
   */
  cancelEditRate(): void {
    this.editingRateId.set(null);
    this.newRate = 0;
  }

  // PUBLIC_INTERFACE
  /**
   * Update the hourly rate for a category.
   */
  updateRate(id: number): void {
    if (this.newRate <= 0) {
      this.error.set('Hourly rate must be greater than 0');
      return;
    }

    this.updatingRate.set(true);
    this.error.set(null);

    const request: UpdateCategoryRateRequest = { newRate: this.newRate };

    this.apiService.updateCategoryRate(id, request).subscribe({
      next: (updated) => {
        this.categories.update((list) => list.map((c) => (c.id === id ? updated : c)));
        this.editingRateId.set(null);
        this.updatingRate.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to update rate');
        this.updatingRate.set(false);
      },
    });
  }

  private resetForm(): void {
    this.newCategory = { name: '', description: '', hourlyRate: 0 };
  }
}

import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type { CustomerDto, CreateCustomerRequest } from '../models/api.models';

/**
 * Customers component for listing, creating, and deleting customers.
 */
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  customers = signal<CustomerDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showCreateForm = signal<boolean>(false);
  creating = signal<boolean>(false);
  deleting = signal<Set<number>>(new Set());

  newCustomer: CreateCustomerRequest = {
    name: '',
    email: '',
    address: '',
  };

  ngOnInit(): void {
    this.loadCustomers();
  }

  // PUBLIC_INTERFACE
  /**
   * Load all customers from the backend.
   */
  loadCustomers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.listCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load customers');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle the create customer form visibility.
   */
  toggleCreateForm(): void {
    this.showCreateForm.update((v) => !v);
    if (!this.showCreateForm()) {
      this.resetForm();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new customer.
   */
  createCustomer(): void {
    if (!this.newCustomer.name.trim() || !this.newCustomer.email.trim()) {
      this.error.set('Name and email are required');
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    this.apiService.createCustomer(this.newCustomer).subscribe({
      next: (created) => {
        this.customers.update((list) => [...list, created]);
        this.resetForm();
        this.showCreateForm.set(false);
        this.creating.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to create customer');
        this.creating.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a customer by ID.
   */
  deleteCustomer(id: number): void {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    this.deleting.update((set) => new Set(set).add(id));
    this.error.set(null);

    this.apiService.deleteCustomer(id).subscribe({
      next: () => {
        this.customers.update((list) => list.filter((c) => c.id !== id));
        this.deleting.update((set) => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to delete customer');
        this.deleting.update((set) => {
          const newSet = new Set(set);
          newSet.delete(id);
          return newSet;
        });
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Check if a customer is being deleted.
   */
  isDeleting(id: number): boolean {
    return this.deleting().has(id);
  }

  private resetForm(): void {
    this.newCustomer = { name: '', email: '', address: '' };
  }
}

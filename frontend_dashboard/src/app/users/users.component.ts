import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type { UserDto, CreateUserRequest } from '../models/api.models';

/**
 * Users component for listing and creating users.
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  users = signal<UserDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showCreateForm = signal<boolean>(false);
  creating = signal<boolean>(false);

  newUser: CreateUserRequest = {
    name: '',
    email: '',
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  // PUBLIC_INTERFACE
  /**
   * Load all users from the backend.
   */
  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.listUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle the create user form visibility.
   */
  toggleCreateForm(): void {
    this.showCreateForm.update((v) => !v);
    if (!this.showCreateForm()) {
      this.resetForm();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new user.
   */
  createUser(): void {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) {
      this.error.set('Name and email are required');
      return;
    }

    this.creating.set(true);
    this.error.set(null);

    this.apiService.createUser(this.newUser).subscribe({
      next: (created) => {
        this.users.update((list) => [...list, created]);
        this.resetForm();
        this.showCreateForm.set(false);
        this.creating.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to create user');
        this.creating.set(false);
      },
    });
  }

  private resetForm(): void {
    this.newUser = { name: '', email: '' };
  }
}

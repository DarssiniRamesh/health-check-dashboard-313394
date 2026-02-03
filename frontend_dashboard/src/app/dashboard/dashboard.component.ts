import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import type { DashboardSummaryDto } from '../models/api.models';

/**
 * Dashboard component displaying summary metrics.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  summary = signal<DashboardSummaryDto | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSummary();
  }

  // PUBLIC_INTERFACE
  /**
   * Load dashboard summary from the backend.
   */
  loadSummary(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load dashboard summary');
        this.loading.set(false);
      },
    });
  }
}

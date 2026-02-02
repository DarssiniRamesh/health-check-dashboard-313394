import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { finalize, Subscription, timer } from 'rxjs';
import { HealthService, type HealthCheckResult } from './health.service';
import type { HealthResponse } from './health.models';

type UiStatus = 'UP' | 'DOWN' | 'UNKNOWN';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './health.component.html',
  styleUrl: './health.component.css',
})
export class HealthComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private refreshSub?: Subscription;

  loading = signal<boolean>(false);
  lastSuccessAt = signal<Date | null>(null);
  lastAttemptAt = signal<Date | null>(null);
  lastError = signal<string | null>(null);
  health = signal<HealthResponse | null>(null);

  overallStatus = computed<UiStatus>(() => {
    const data = this.health();
    if (!data) return 'UNKNOWN';
    const s = String(data.status ?? '').toUpperCase();
    if (s === 'UP') return 'UP';
    if (s === 'DOWN') return 'DOWN';
    return 'UNKNOWN';
  });

  dbStatus = computed<UiStatus>(() => {
    const data = this.health();
    if (!data) return 'UNKNOWN';

    const nested = data.db?.status ?? data.dbStatus;
    const s = String(nested ?? '').toUpperCase();
    if (['CONNECTED', 'UP', 'OK'].includes(s)) return 'UP';
    if (['DISCONNECTED', 'DOWN', 'ERROR'].includes(s)) return 'DOWN';
    return 'UNKNOWN';
  });

  dbDetails = computed<string | null>(() => {
    const data = this.health();
    if (!data) return null;

    const details =
      data.db?.details ??
      data.db?.message ??
      data.dbDetails ??
      data.details ??
      null;

    return details ? String(details) : null;
  });

  uptimeLabel = computed<string>(() => {
    const data = this.health();
    if (!data) return '—';

    if (typeof data.uptimeSeconds === 'number') {
      return this.formatDurationSeconds(data.uptimeSeconds);
    }
    if (typeof data.uptimeMs === 'number') {
      return this.formatDurationSeconds(Math.floor(data.uptimeMs / 1000));
    }
    return '—';
  });

  constructor(private readonly healthService: HealthService) {}

  ngOnInit(): void {
    // Avoid making outbound HTTP calls during SSR/prerender, which can cause timeouts.
    if (!isPlatformBrowser(this.platformId)) return;

    // Initial fetch + auto-refresh every 30 seconds.
    this.refresh();
    this.refreshSub = timer(30000, 30000).subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Triggers a manual health refresh. */
    this.loading.set(true);
    this.lastAttemptAt.set(new Date());
    this.lastError.set(null);

    this.healthService
      .fetchHealth()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result: HealthCheckResult) => this.applyResult(result));
  }

  private applyResult(result: HealthCheckResult): void {
    if (result.ok && result.data) {
      this.health.set(result.data);
      this.lastSuccessAt.set(new Date());
      this.lastError.set(null);
      return;
    }

    // Do not wipe last good state; keep showing prior success but indicate error.
    this.lastError.set(result.errorMessage ?? 'Health check failed.');
  }

  private formatDurationSeconds(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
}

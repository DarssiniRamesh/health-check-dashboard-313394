import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import type { HealthResponse } from './health.models';

export interface HealthCheckResult {
  /** True when the request succeeded and backend reports UP (best-effort). */
  ok: boolean;
  /** Raw response payload (if request succeeded). */
  data?: HealthResponse;
  /** User-presentable error message (if request failed). */
  errorMessage?: string;
}

/**
 * HealthService calls the backend health endpoint.
 */
@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    (environment.apiBaseUrl ?? environment.BACKEND_API_URL ?? 'http://localhost:3001').replace(/\/$/, '');

  /**
   * Fetches the backend health information from `/health`.
   */
  fetchHealth() {
    const url = `${this.baseUrl}/health`;
    return this.http.get<HealthResponse>(url).pipe(
      map((data) => {
        const status = String(data?.status ?? '').toUpperCase();
        const ok = status === 'UP';
        return { ok, data } satisfies HealthCheckResult;
      }),
      catchError((err) => {
        // CORS or network failures often land here; keep message friendly.
        const message =
          typeof err?.message === 'string' && err.message.length > 0
            ? err.message
            : 'Unable to reach backend. Check that backend is running and CORS is configured.';
        return of({ ok: false, errorMessage: message } satisfies HealthCheckResult);
      }),
    );
  }
}

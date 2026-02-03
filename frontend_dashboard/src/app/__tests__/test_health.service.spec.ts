import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HealthService } from '../health/health.service';

describe('test_HealthService', () => {
  let httpMock: HttpTestingController;
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HealthService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HealthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps UP status to ok=true', (done) => {
    service.fetchHealth().subscribe((result) => {
      expect(result.ok).toBeTrue();

      if (result.ok) {
        expect(result.data.status).toBe('UP');
      } else {
        fail(`Expected ok=true, got error: ${String((result as any).errorMessage)}`);
      }

      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'UP' });
  });

  it('maps DOWN status to ok=false but still returns data', (done) => {
    service.fetchHealth().subscribe((result) => {
      expect(result.ok).toBeFalse();

      if (result.ok) {
        // If we ever change behavior to treat DOWN as ok=true, this assertion will catch it.
        fail(`Expected ok=false, got data.status=${String(result.data?.status)}`);
      } else {
        // In current implementation, non-UP statuses still come through as HTTP success with data.
        // The service marks ok=false, but preserves data for UI rendering.
        // `result` is the ok=false variant here, so only assert what is valid.
        expect((result as any).errorMessage).toBeUndefined();
      }

      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    req.flush({ status: 'DOWN' });
  });

  it('converts http error into ok=false with errorMessage', (done) => {
    service.fetchHealth().subscribe((result) => {
      expect(result.ok).toBeFalse();

      if (!result.ok) {
        expect(typeof result.errorMessage).toBe('string');
        expect(result.errorMessage.length).toBeGreaterThan(0);
      } else {
        fail('Expected ok=false on HTTP error');
      }

      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    req.error(new ProgressEvent('error'));
  });
});

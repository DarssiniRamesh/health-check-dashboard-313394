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
      expect(result.data?.status).toBe('UP');
      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    expect(req.request.method).toBe('GET');
    req.flush({ status: 'UP' });
  });

  it('maps DOWN status to ok=false but still returns data', (done) => {
    service.fetchHealth().subscribe((result) => {
      expect(result.ok).toBeFalse();
      expect(result.data?.status).toBe('DOWN');
      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    req.flush({ status: 'DOWN' });
  });

  it('converts http error into ok=false with errorMessage', (done) => {
    service.fetchHealth().subscribe((result) => {
      expect(result.ok).toBeFalse();
      expect(typeof result.errorMessage).toBe('string');
      expect(result.errorMessage!.length).toBeGreaterThan(0);
      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/health'));
    req.error(new ProgressEvent('error'));
  });
});

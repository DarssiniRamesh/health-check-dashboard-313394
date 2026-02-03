import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../services/api.service';

describe('test_ApiService', () => {
  let httpMock: HttpTestingController;
  let api: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('listUsers calls GET /api/users', (done) => {
    api.listUsers().subscribe((users) => {
      expect(users.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/users'));
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, email: 'a@b.com', name: 'A' }]);
  });

  it('listRecentHours includes limit query param', (done) => {
    api.listRecentHours(42).subscribe(() => done());

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/hours') && r.params.get('limit') === '42');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('updateCategoryRate calls PATCH /api/categories/{id}/rate', (done) => {
    api.updateCategoryRate(5, { newRate: 123 }).subscribe(() => done());

    const req = httpMock.expectOne((r) => r.url.endsWith('/api/categories/5/rate'));
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newRate: 123 });
    req.flush({ id: 5, name: 'Cat', hourlyRate: 123 });
  });
});

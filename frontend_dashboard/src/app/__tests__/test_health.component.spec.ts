import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HealthComponent } from '../health/health.component';
import { HealthService } from '../health/health.service';

describe('test_HealthComponent', () => {
  it('refresh updates health and lastSuccessAt when service returns ok', () => {
    const mockHealthService: Partial<HealthService> = {
      fetchHealth: () => of({ ok: true, data: { status: 'UP', timestamp: 'now' } }),
    };

    TestBed.configureTestingModule({
      imports: [HealthComponent],
      providers: [{ provide: HealthService, useValue: mockHealthService }],
    });

    const fixture = TestBed.createComponent(HealthComponent);
    const component = fixture.componentInstance;

    component.refresh();

    expect(component.health()).toEqual(jasmine.objectContaining({ status: 'UP' }));
    expect(component.lastSuccessAt()).not.toBeNull();
    expect(component.lastError()).toBeNull();
    expect(component.overallStatus()).toBe('UP');
  });

  it('refresh sets lastError when service returns ok=false', () => {
    const mockHealthService: Partial<HealthService> = {
      fetchHealth: () => of({ ok: false, errorMessage: 'No backend' }),
    };

    TestBed.configureTestingModule({
      imports: [HealthComponent],
      providers: [{ provide: HealthService, useValue: mockHealthService }],
    });

    const fixture = TestBed.createComponent(HealthComponent);
    const component = fixture.componentInstance;

    component.refresh();

    expect(component.lastError()).toBe('No backend');
    // Should not wipe last known health state (still null initially).
    expect(component.health()).toBeNull();
  });
});

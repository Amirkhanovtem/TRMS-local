import { TestBed } from '@angular/core/testing';

import { UnavailabilityResourcesPeriodService } from './unavailability-resources-period.service';

describe('UnavailabilityResourcesPeriodService', () => {
  let service: UnavailabilityResourcesPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnavailabilityResourcesPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

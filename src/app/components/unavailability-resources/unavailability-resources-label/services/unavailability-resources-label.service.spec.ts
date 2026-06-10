import { TestBed } from '@angular/core/testing';

import { UnavailabilityResourcesLabelService } from './unavailability-resources-label.service';

describe('UnavailabilityResourcesTypeService', () => {
  let service: UnavailabilityResourcesLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnavailabilityResourcesLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

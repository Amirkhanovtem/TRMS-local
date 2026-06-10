import { TestBed } from '@angular/core/testing';

import { ReplaceModuleServiceService } from './replace-module-service.service';

describe('ReplaceModuleServiceService', () => {
  let service: ReplaceModuleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplaceModuleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

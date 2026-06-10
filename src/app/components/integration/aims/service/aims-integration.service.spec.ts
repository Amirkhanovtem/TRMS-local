import { TestBed } from '@angular/core/testing';

import { AimsIntegrationService } from './aims-integration.service';

describe('AimsIntegrationService', () => {
  let service: AimsIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AimsIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

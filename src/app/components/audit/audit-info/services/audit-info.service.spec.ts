import { TestBed } from '@angular/core/testing';

import { AuditInfoService } from './audit-info.service';

describe('AuditInfoService', () => {
  let service: AuditInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

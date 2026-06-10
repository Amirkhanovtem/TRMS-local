import { TestBed } from '@angular/core/testing';

import { CertificateIssueService } from './certificate-issue.service';

describe('CertificateIssueService', () => {
  let service: CertificateIssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateIssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

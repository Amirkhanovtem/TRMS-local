import { TestBed } from '@angular/core/testing';

import { ReissueCertificateService } from './reissue-certificate.service';

describe('ReissueCertificateService', () => {
  let service: ReissueCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReissueCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

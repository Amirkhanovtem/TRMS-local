import { TestBed } from '@angular/core/testing';

import { CertificateTemplateGroupService } from './certificate-template-group.service';

describe('CertificateTemplateGroupService', () => {
  let service: CertificateTemplateGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateTemplateGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

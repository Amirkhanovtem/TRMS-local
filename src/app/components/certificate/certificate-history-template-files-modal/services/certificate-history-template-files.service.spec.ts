import { TestBed } from '@angular/core/testing';

import { CertificateHistoryTemplateFilesService } from './certificate-history-template-files.service';

describe('CertificateHistoryTemplateFilesService', () => {
  let service: CertificateHistoryTemplateFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateHistoryTemplateFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

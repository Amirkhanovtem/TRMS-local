import { TestBed } from '@angular/core/testing';

import { TrainingTemplateCertificateTemplateHistoryService } from './training-template-certificate-template-history.service';

describe('TrainingTemplateCertificateTemplateHistoryService', () => {
  let service: TrainingTemplateCertificateTemplateHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingTemplateCertificateTemplateHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

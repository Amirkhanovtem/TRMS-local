import { TestBed } from '@angular/core/testing';

import { ExamTemplateService } from './exam-template.service';

describe('ExamService', () => {
  let service: ExamTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

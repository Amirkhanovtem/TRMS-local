import { TestBed } from '@angular/core/testing';

import { ExamAttemptAttachmentsService } from './exam-attempt-attachments.service';

describe('ExamAttemptAttachmentsService', () => {
  let service: ExamAttemptAttachmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamAttemptAttachmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TrainingAttachmentsService } from './training-attachments.service';

describe('TrainingAttachmentsService', () => {
  let service: TrainingAttachmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingAttachmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

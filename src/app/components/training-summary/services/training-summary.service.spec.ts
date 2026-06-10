import { TestBed } from '@angular/core/testing';

import { TrainingSummaryService } from './training-summary.service';

describe('TrainingSummaryService', () => {
  let service: TrainingSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

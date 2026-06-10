import { TestBed } from '@angular/core/testing';

import { AttendedTrainingService } from './attended-training.service';

describe('AttendedTrainingService', () => {
  let service: AttendedTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendedTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

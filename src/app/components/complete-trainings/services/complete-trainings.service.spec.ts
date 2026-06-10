import { TestBed } from '@angular/core/testing';

import { CompleteTrainingsService } from './complete-trainings.service';

describe('CompleteTrainingsService', () => {
  let service: CompleteTrainingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompleteTrainingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

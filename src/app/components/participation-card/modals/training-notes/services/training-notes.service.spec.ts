import { TestBed } from '@angular/core/testing';

import { TrainingNotesService } from './training-notes.service';

describe('TrainingNotesService', () => {
  let service: TrainingNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

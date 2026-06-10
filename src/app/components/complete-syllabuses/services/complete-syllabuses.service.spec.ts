import { TestBed } from '@angular/core/testing';

import { CompleteSyllabusesService } from './complete-syllabuses.service';

describe('CompletedSyllabusesService', () => {
  let service: CompleteSyllabusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompleteSyllabusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

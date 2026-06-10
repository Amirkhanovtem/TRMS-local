import { TestBed } from '@angular/core/testing';

import { TimetableDisplayService } from './timetable-display.service';

describe('TimetableDisplayService', () => {
  let service: TimetableDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetableDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

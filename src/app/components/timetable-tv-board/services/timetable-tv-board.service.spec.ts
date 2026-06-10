import { TestBed } from '@angular/core/testing';

import { TimetableTvBoardService } from './timetable-tv-board.service';

describe('TimetableTvBoardService', () => {
  let service: TimetableTvBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetableTvBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

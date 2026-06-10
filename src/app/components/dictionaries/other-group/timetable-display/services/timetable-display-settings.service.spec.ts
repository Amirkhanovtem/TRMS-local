import { TestBed } from '@angular/core/testing';

import { TimetableDisplaySettingsService } from './timetable-display-settings.service';

describe('TimetableDisplaySettingsService', () => {
  let service: TimetableDisplaySettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetableDisplaySettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

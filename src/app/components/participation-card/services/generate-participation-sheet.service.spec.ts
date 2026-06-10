import { TestBed } from '@angular/core/testing';

import { GenerateParticipationSheetService } from './generate-participation-sheet.service';

describe('GenerateParticipationSheetService', () => {
  let service: GenerateParticipationSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateParticipationSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

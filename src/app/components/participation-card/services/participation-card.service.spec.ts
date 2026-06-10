import { TestBed } from '@angular/core/testing';

import { ParticipationCardService } from './participation-card.service';

describe('ParticipationCardService', () => {
  let service: ParticipationCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipationCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

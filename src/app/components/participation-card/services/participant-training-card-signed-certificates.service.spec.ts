import { TestBed } from '@angular/core/testing';

import { ParticipantTrainingCardSignedCertificatesService } from './participant-training-card-signed-certificates.service';

describe('ParticipantTrainingCardSignedCertificatesService', () => {
  let service: ParticipantTrainingCardSignedCertificatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantTrainingCardSignedCertificatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

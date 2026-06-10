import { TestBed } from '@angular/core/testing';

import { TrainingTemplateService } from './training-template.service';

describe('TreainingTemplateService', () => {
  let service: TrainingTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { StandardMultiSelectionService } from './standard-multi-selection.service';

describe('StandardMultiSelectionService', () => {
  let service: StandardMultiSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandardMultiSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

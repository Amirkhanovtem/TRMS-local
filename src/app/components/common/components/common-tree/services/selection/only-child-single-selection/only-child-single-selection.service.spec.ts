import { TestBed } from '@angular/core/testing';

import { OnlyChildSingleSelectionService } from './only-child-single-selection.service';

describe('OnlyChildSingleSelectionService', () => {
  let service: OnlyChildSingleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlyChildSingleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

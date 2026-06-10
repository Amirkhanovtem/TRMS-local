import { TestBed } from '@angular/core/testing';

import { MultiParentNodeSelectionService } from './multi-parent-node-selection.service';

describe('MultiSelectFromOnlyFromParentToChildService', () => {
  let service: MultiParentNodeSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiParentNodeSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

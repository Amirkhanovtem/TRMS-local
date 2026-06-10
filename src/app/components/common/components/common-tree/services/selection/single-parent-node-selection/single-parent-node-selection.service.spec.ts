import { TestBed } from '@angular/core/testing';

import { SingleParentNodeSelectionService } from './single-parent-node-selection.service';

describe('SingleParentNodeSelectionService', () => {
  let service: SingleParentNodeSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleParentNodeSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

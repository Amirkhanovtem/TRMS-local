import { TestBed } from '@angular/core/testing';

import { SelectionBuilderService } from './selection-builder.service';

describe('SelectionService', () => {
  let service: SelectionBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

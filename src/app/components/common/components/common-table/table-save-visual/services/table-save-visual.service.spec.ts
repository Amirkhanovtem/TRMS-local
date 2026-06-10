import { TestBed } from '@angular/core/testing';

import { TableSaveVisualService } from './table-save-visual.service';

describe('TableSaveVisualService', () => {
  let service: TableSaveVisualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableSaveVisualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

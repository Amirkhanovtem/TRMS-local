import { TestBed } from '@angular/core/testing';

import { TableHeaderDragAndDropService } from './table-header-drag-and-drop.service';

describe('TableHeaderDragAndDropService', () => {
  let service: TableHeaderDragAndDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableHeaderDragAndDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

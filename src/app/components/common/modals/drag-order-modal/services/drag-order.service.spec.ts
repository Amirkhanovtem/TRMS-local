import { TestBed } from '@angular/core/testing';

import { DragOrderService } from './drag-order.service';

describe('DragOrderService', () => {
  let service: DragOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DragOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

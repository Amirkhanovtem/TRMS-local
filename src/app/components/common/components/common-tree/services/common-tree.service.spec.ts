import { TestBed } from '@angular/core/testing';

import { CommonTreeService } from './common-tree.service';

describe('CommonTreeService', () => {
  let service: CommonTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { JoditService } from './jodit.service';

describe('JoditService', () => {
  let service: JoditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TagPersonLinkerService } from './tag-person-linker.service';

describe('TagPersonLinkerService', () => {
  let service: TagPersonLinkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagPersonLinkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

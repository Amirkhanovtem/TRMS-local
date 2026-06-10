import { TestBed } from '@angular/core/testing';

import { TagResourceLinkerService } from './tag-resource-linker.service';

describe('TagResourceLinkerService', () => {
  let service: TagResourceLinkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagResourceLinkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

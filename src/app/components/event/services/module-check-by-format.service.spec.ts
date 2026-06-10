import { TestBed } from '@angular/core/testing';

import { ModuleCheckByFormatService } from './module-check-by-format.service';

describe('ModuleCheckByTypeService', () => {
  let service: ModuleCheckByFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleCheckByFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

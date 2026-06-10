import { TestBed } from '@angular/core/testing';

import { TrainerCategoryService } from './trainer-category.service';

describe('TrainerCategoryService', () => {
  let service: TrainerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainerCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TraineeCartFilterService } from './trainee-cart-filter.service';

describe('TraineeCartFilterService', () => {
  let service: TraineeCartFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeCartFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

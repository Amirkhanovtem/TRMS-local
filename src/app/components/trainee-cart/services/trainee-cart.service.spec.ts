import { TestBed } from '@angular/core/testing';

import { TraineeCartService } from './trainee-cart.service';

describe('TraineeCartService', () => {
  let service: TraineeCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineeCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

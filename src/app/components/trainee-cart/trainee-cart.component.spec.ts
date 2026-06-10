import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeCartComponent } from './trainee-cart.component';

describe('TraineeCartComponent', () => {
  let component: TraineeCartComponent;
  let fixture: ComponentFixture<TraineeCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TraineeCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

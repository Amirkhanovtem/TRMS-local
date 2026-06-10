import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeCartDetailTableComponent } from './trainee-cart-detail-table.component';

describe('TraineeCartDetailTableComponent', () => {
  let component: TraineeCartDetailTableComponent;
  let fixture: ComponentFixture<TraineeCartDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeCartDetailTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TraineeCartDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

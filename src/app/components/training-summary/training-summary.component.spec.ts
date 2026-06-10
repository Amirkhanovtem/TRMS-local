import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSummaryComponent } from './training-summary.component';

describe('TrainingSummaryComponent', () => {
  let component: TrainingSummaryComponent;
  let fixture: ComponentFixture<TrainingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

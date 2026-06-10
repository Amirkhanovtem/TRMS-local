import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingResourceStepComponent } from './training-resource-step.component';

describe('TrainingResourceStepComponent', () => {
  let component: TrainingResourceStepComponent;
  let fixture: ComponentFixture<TrainingResourceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingResourceStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingResourceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

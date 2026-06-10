import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingPersonTrainerStepComponent } from './training-person-trainer-step.component';

describe('TrainingPersonTrainingStepComponent', () => {
  let component: TrainingPersonTrainerStepComponent;
  let fixture: ComponentFixture<TrainingPersonTrainerStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingPersonTrainerStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingPersonTrainerStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

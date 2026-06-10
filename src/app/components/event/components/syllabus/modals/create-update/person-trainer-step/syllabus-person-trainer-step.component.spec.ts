import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusPersonTrainerStepComponent } from './syllabus-person-trainer-step.component';

describe('SyllabusPersonTrainerStepComponent', () => {
  let component: SyllabusPersonTrainerStepComponent;
  let fixture: ComponentFixture<SyllabusPersonTrainerStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyllabusPersonTrainerStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyllabusPersonTrainerStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

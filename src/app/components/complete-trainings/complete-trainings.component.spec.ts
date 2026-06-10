import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteTrainingsComponent } from './complete-trainings.component';

describe('CompleteTrainingsComponent', () => {
  let component: CompleteTrainingsComponent;
  let fixture: ComponentFixture<CompleteTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteTrainingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

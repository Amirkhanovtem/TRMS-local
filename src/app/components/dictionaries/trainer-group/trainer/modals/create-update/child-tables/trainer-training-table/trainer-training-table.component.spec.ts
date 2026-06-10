import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerTrainingTableComponent } from './trainer-training-table.component';

describe('TrainerTrainingTableComponent', () => {
  let component: TrainerTrainingTableComponent;
  let fixture: ComponentFixture<TrainerTrainingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainerTrainingTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerTrainingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingNotesComponent } from './training-notes.component';

describe('TrainingNotesComponent', () => {
  let component: TrainingNotesComponent;
  let fixture: ComponentFixture<TrainingNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

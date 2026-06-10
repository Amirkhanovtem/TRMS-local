import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingNotesModalComponent } from './create-update-training-notes-modal.component';

describe('CreateUpdateTrainingNotesModalComponent', () => {
  let component: CreateUpdateTrainingNotesModalComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTrainingNotesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTrainingNotesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

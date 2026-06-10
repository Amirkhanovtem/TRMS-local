import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTemplateSelectionModalComponent } from './training-template-selection-modal.component';

describe('TrainingTemplateSelectionModalComponent', () => {
  let component: TrainingTemplateSelectionModalComponent;
  let fixture: ComponentFixture<TrainingTemplateSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingTemplateSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingTemplateSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

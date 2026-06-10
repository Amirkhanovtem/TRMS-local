import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTemplateTrainingTemplateTableComponent } from './exam-template-training-template-table.component';

describe('ExamTemplateTrainingTemplateTableComponent', () => {
  let component: ExamTemplateTrainingTemplateTableComponent;
  let fixture: ComponentFixture<ExamTemplateTrainingTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamTemplateTrainingTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamTemplateTrainingTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

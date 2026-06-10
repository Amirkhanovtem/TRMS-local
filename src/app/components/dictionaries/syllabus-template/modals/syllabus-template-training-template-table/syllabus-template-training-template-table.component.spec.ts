import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusTemplateTrainingTemplateTableComponent } from './syllabus-template-training-template-table.component';

describe('SyllabusTemplateTrainingTemplateTableComponent', () => {
  let component: SyllabusTemplateTrainingTemplateTableComponent;
  let fixture: ComponentFixture<SyllabusTemplateTrainingTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyllabusTemplateTrainingTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyllabusTemplateTrainingTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

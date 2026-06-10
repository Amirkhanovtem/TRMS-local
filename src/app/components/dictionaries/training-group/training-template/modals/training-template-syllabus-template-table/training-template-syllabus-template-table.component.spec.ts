import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTemplateSyllabusTemplateTableComponent } from './training-template-syllabus-template-table.component';

describe('TrainingTemplateSyllabusTemplateTableComponent', () => {
  let component: TrainingTemplateSyllabusTemplateTableComponent;
  let fixture: ComponentFixture<TrainingTemplateSyllabusTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingTemplateSyllabusTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingTemplateSyllabusTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

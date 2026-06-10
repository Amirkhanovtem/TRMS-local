import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusTrainingTableComponent } from './syllabus-training-table.component';

describe('SyllabusTrainingTableComponent', () => {
  let component: SyllabusTrainingTableComponent;
  let fixture: ComponentFixture<SyllabusTrainingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyllabusTrainingTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyllabusTrainingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

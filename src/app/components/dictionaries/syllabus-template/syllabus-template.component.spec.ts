import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusTemplateComponent } from './syllabus-template.component';

describe('SyllabusTemplateComponent', () => {
  let component: SyllabusTemplateComponent;
  let fixture: ComponentFixture<SyllabusTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyllabusTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyllabusTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

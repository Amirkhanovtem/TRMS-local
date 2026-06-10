import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateSyllabusTemplateComponent } from './create-update-syllabus-template.component';

describe('CreateUpdateSyllabusTemplateComponent', () => {
  let component: CreateUpdateSyllabusTemplateComponent;
  let fixture: ComponentFixture<CreateUpdateSyllabusTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateSyllabusTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateSyllabusTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

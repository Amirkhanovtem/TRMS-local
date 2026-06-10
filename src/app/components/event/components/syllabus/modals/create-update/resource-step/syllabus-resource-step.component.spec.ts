import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllabusResourceStepComponent } from './syllabus-resource-step.component';

describe('SyllabusResourceStepComponent', () => {
  let component: SyllabusResourceStepComponent;
  let fixture: ComponentFixture<SyllabusResourceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyllabusResourceStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyllabusResourceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateExamTemplateModalComponent } from './create-update-exam-template-modal.component';

describe('CreateUpdateExamModalComponent', () => {
  let component: CreateUpdateExamTemplateModalComponent;
  let fixture: ComponentFixture<CreateUpdateExamTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateExamTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateExamTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

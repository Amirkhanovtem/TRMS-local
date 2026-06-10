import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTemplateCertificateTemplateHistoryModalComponent } from './training-template-certificate-template-history-modal.component';

describe('TrainingTemplateCertificateTemplateHistoryModalComponent', () => {
  let component: TrainingTemplateCertificateTemplateHistoryModalComponent;
  let fixture: ComponentFixture<TrainingTemplateCertificateTemplateHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingTemplateCertificateTemplateHistoryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingTemplateCertificateTemplateHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

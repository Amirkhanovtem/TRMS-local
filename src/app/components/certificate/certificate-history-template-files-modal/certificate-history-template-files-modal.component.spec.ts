import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateHistoryTemplateFilesModalComponent } from './certificate-history-template-files-modal.component';

describe('CertificateHistoryTemplateFilesModalComponent', () => {
  let component: CertificateHistoryTemplateFilesModalComponent;
  let fixture: ComponentFixture<CertificateHistoryTemplateFilesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateHistoryTemplateFilesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateHistoryTemplateFilesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

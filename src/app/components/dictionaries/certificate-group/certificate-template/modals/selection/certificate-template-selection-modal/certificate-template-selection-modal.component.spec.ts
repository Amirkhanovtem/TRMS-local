import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTemplateSelectionModalComponent } from './certificate-template-selection-modal.component';

describe('CertificateTemplateSelectionModalComponent', () => {
  let component: CertificateTemplateSelectionModalComponent;
  let fixture: ComponentFixture<CertificateTemplateSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateTemplateSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateTemplateSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCertificateTemplateModalComponent } from './create-update-certificate-template-modal.component';

describe('CreateUpdateCertificateModalComponent', () => {
  let component: CreateUpdateCertificateTemplateModalComponent;
  let fixture: ComponentFixture<CreateUpdateCertificateTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateCertificateTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCertificateTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTemplateComponent } from './certificate-template.component';

describe('CertificateComponent', () => {
  let component: CertificateTemplateComponent;
  let fixture: ComponentFixture<CertificateTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTemplateGroupComponent } from './certificate-template-group.component';

describe('CertificateTemplateGroupComponent', () => {
  let component: CertificateTemplateGroupComponent;
  let fixture: ComponentFixture<CertificateTemplateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateTemplateGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateTemplateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

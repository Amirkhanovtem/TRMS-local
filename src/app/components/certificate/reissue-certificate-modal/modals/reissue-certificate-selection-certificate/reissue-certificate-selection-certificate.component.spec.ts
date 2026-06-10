import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueCertificateSelectionCertificateComponent } from './reissue-certificate-selection-certificate.component';

describe('ReissueCertificateSelectionCertificateComponent', () => {
  let component: ReissueCertificateSelectionCertificateComponent;
  let fixture: ComponentFixture<ReissueCertificateSelectionCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReissueCertificateSelectionCertificateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReissueCertificateSelectionCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

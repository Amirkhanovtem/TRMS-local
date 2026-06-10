import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueCertificateModalComponent } from './reissue-certificate-modal.component';

describe('ReissueCertificateModalComponent', () => {
  let component: ReissueCertificateModalComponent;
  let fixture: ComponentFixture<ReissueCertificateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReissueCertificateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReissueCertificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateIssueComponent } from './certificate-issue.component';

describe('CertificateIssueComponent', () => {
  let component: CertificateIssueComponent;
  let fixture: ComponentFixture<CertificateIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateIssueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

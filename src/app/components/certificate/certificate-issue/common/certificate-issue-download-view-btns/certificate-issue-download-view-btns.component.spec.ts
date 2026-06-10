import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateIssueDownloadViewBtnsComponent } from './certificate-issue-download-view-btns.component';

describe('CertificateIssueDownloadViewBtnsComponent', () => {
  let component: CertificateIssueDownloadViewBtnsComponent;
  let fixture: ComponentFixture<CertificateIssueDownloadViewBtnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateIssueDownloadViewBtnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateIssueDownloadViewBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCertificateByParticipantCardIdsComponent } from './download-certificate-by-participant-card-ids.component';

describe('DownloadCertificateByParticipantCardIdsComponent', () => {
  let component: DownloadCertificateByParticipantCardIdsComponent;
  let fixture: ComponentFixture<DownloadCertificateByParticipantCardIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadCertificateByParticipantCardIdsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadCertificateByParticipantCardIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

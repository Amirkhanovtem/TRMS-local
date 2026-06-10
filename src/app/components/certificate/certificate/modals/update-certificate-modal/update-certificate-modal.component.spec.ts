import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCertificateModalComponent } from './update-certificate-modal.component';

describe('UpdateCertificateModalComponent', () => {
  let component: UpdateCertificateModalComponent;
  let fixture: ComponentFixture<UpdateCertificateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCertificateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCertificateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

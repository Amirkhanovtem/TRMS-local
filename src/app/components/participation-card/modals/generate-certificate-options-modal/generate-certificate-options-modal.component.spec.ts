import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCertificateOptionsModalComponent } from './generate-certificate-options-modal.component';

describe('GenerateCertificateOptionsModalComponent', () => {
  let component: GenerateCertificateOptionsModalComponent;
  let fixture: ComponentFixture<GenerateCertificateOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateCertificateOptionsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateCertificateOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

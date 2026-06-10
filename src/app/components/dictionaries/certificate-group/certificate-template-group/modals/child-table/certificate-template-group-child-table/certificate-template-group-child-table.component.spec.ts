import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateTemplateGroupChildTableComponent } from './certificate-template-group-child-table.component';

describe('CertificateTemplateGroupChildTableComponent', () => {
  let component: CertificateTemplateGroupChildTableComponent;
  let fixture: ComponentFixture<CertificateTemplateGroupChildTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateTemplateGroupChildTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateTemplateGroupChildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

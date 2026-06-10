import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateReissueHierarchyTableComponent } from './certificate-reissue-hierarchy-table.component';

describe('CertificateReissueHierarchyTableComponent', () => {
  let component: CertificateReissueHierarchyTableComponent;
  let fixture: ComponentFixture<CertificateReissueHierarchyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificateReissueHierarchyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificateReissueHierarchyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

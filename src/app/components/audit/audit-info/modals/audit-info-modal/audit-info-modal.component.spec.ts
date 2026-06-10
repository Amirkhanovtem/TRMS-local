import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInfoModalComponent } from './audit-info-modal.component';

describe('AuditInfoModalComponent', () => {
  let component: AuditInfoModalComponent;
  let fixture: ComponentFixture<AuditInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditInfoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuditInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

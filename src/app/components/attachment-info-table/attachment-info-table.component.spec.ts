import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentInfoTableComponent } from './attachment-info-table.component';

describe('AttachmentInfoTableComponent', () => {
  let component: AttachmentInfoTableComponent;
  let fixture: ComponentFixture<AttachmentInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentInfoTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

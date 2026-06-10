import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentNotificationSelectionTableComponent } from './sent-notification-selection-table.component';

describe('SendedNotificationSelectionTableComponent', () => {
  let component: SentNotificationSelectionTableComponent;
  let fixture: ComponentFixture<SentNotificationSelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SentNotificationSelectionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SentNotificationSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

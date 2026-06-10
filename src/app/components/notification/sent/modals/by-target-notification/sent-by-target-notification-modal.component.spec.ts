import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentByTargetNotificationModalComponent } from './sent-by-target-notification-modal.component';

describe('TargetSentNotificationComponent', () => {
  let component: SentByTargetNotificationModalComponent;
  let fixture: ComponentFixture<SentByTargetNotificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SentByTargetNotificationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SentByTargetNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentNotificationComponent } from './sent-notification.component';

describe('SendedNotificationComponent', () => {
  let component: SentNotificationComponent;
  let fixture: ComponentFixture<SentNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SentNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

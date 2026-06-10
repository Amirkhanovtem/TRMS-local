import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateTimeStepComponent } from './notification-template-time-step.component';

describe('NotificationTimeStepComponent', () => {
  let component: NotificationTemplateTimeStepComponent;
  let fixture: ComponentFixture<NotificationTemplateTimeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateTimeStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateTimeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

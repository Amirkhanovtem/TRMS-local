import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateTargetAudienceStepComponent } from './notification-template-target-audience-step.component';

describe('NotificationTargetAudienceComponent', () => {
  let component: NotificationTemplateTargetAudienceStepComponent;
  let fixture: ComponentFixture<NotificationTemplateTargetAudienceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateTargetAudienceStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateTargetAudienceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

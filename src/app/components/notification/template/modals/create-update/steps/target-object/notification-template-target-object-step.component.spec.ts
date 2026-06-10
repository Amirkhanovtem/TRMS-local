import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateTargetObjectStepComponent } from './notification-template-target-object-step.component';

describe('NotificationTemplateTargetObjectStepComponent', () => {
  let component: NotificationTemplateTargetObjectStepComponent;
  let fixture: ComponentFixture<NotificationTemplateTargetObjectStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateTargetObjectStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateTargetObjectStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

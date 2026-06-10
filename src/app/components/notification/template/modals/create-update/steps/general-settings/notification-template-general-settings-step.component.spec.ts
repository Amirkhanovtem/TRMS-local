import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateGeneralSettingsStepComponent } from './notification-template-general-settings-step.component';

describe('NotificationMainSettingsStepComponent', () => {
  let component: NotificationTemplateGeneralSettingsStepComponent;
  let fixture: ComponentFixture<NotificationTemplateGeneralSettingsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateGeneralSettingsStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateGeneralSettingsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

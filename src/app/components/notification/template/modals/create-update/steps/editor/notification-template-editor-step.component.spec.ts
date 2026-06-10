import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateEditorStepComponent } from './notification-template-editor-step.component';

describe('NotificationEditorStepComponent', () => {
  let component: NotificationTemplateEditorStepComponent;
  let fixture: ComponentFixture<NotificationTemplateEditorStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateEditorStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateEditorStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

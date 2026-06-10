import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetNotificationTemplateModalComponent } from './target-notification-template-modal.component';

describe('EventNotificationTemplateModalComponent', () => {
  let component: TargetNotificationTemplateModalComponent;
  let fixture: ComponentFixture<TargetNotificationTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TargetNotificationTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TargetNotificationTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

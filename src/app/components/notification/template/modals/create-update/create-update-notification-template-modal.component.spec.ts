import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateNotificationTemplateModalComponent } from './create-update-notification-template-modal.component';

describe('CreateUpdateNotificationModalComponent', () => {
  let component: CreateUpdateNotificationTemplateModalComponent;
  let fixture: ComponentFixture<CreateUpdateNotificationTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateNotificationTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateNotificationTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

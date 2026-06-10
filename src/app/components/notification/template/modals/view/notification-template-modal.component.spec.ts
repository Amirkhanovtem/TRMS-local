import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateModalComponent } from './notification-template-modal.component';

describe('NotificationTemplateModalComponent', () => {
  let component: NotificationTemplateModalComponent;
  let fixture: ComponentFixture<NotificationTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTemplateSelectionTableComponent } from './notification-template-selection-table.component';

describe('NotificationTemplateSelectionTableComponent', () => {
  let component: NotificationTemplateSelectionTableComponent;
  let fixture: ComponentFixture<NotificationTemplateSelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationTemplateSelectionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

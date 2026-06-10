import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedRepeatSettingsComponent } from './need-repeat-settings.component';

describe('NotificationTemplateTimeStepNeedRepeatSettingsComponent', () => {
  let component: NeedRepeatSettingsComponent;
  let fixture: ComponentFixture<NeedRepeatSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeedRepeatSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NeedRepeatSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

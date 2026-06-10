import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDisplaySettingsRoomStepComponent } from './timetable-display-settings-room-step.component';

describe('TimetableDisplaySettingsRoomStepComponent', () => {
  let component: TimetableDisplaySettingsRoomStepComponent;
  let fixture: ComponentFixture<TimetableDisplaySettingsRoomStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimetableDisplaySettingsRoomStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableDisplaySettingsRoomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

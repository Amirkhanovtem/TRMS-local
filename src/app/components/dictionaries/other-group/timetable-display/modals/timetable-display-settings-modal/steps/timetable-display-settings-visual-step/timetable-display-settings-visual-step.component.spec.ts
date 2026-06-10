import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDisplaySettingsVisualStepComponent } from './timetable-display-settings-visual-step.component';

describe('TimetableDisplaySettingsVisualStepComponent', () => {
  let component: TimetableDisplaySettingsVisualStepComponent;
  let fixture: ComponentFixture<TimetableDisplaySettingsVisualStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimetableDisplaySettingsVisualStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableDisplaySettingsVisualStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

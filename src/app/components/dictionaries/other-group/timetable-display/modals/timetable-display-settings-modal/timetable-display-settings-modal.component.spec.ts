import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDisplaySettingsModalComponent } from './timetable-display-settings-modal.component';

describe('TimetableDisplaySettingsModalComponent', () => {
  let component: TimetableDisplaySettingsModalComponent;
  let fixture: ComponentFixture<TimetableDisplaySettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimetableDisplaySettingsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableDisplaySettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

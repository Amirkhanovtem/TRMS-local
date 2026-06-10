import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDisplayComponent } from './timetable-display.component';

describe('TimetableDisplayComponent', () => {
  let component: TimetableDisplayComponent;
  let fixture: ComponentFixture<TimetableDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimetableDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

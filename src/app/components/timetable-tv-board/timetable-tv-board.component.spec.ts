import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableTvBoardComponent } from './timetable-tv-board.component';

describe('TimetableTvBoardComponent', () => {
  let component: TimetableTvBoardComponent;
  let fixture: ComponentFixture<TimetableTvBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimetableTvBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimetableTvBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

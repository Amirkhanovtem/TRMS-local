import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTimetableDisplayModalComponent } from './create-update-timetable-display-modal.component';

describe('CreateUpdateTimetableDisplayModalComponent', () => {
  let component: CreateUpdateTimetableDisplayModalComponent;
  let fixture: ComponentFixture<CreateUpdateTimetableDisplayModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTimetableDisplayModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTimetableDisplayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

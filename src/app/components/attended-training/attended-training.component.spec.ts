import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendedTrainingComponent } from './attended-training.component';

describe('AttendedTrainingComponent', () => {
  let component: AttendedTrainingComponent;
  let fixture: ComponentFixture<AttendedTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendedTrainingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttendedTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

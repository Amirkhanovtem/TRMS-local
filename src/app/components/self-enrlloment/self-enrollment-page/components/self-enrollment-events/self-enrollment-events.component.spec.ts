import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEnrollmentEventsComponent } from './self-enrollment-events.component';

describe('SelfEnrollmentEventsComponent', () => {
  let component: SelfEnrollmentEventsComponent;
  let fixture: ComponentFixture<SelfEnrollmentEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfEnrollmentEventsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEnrollmentEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

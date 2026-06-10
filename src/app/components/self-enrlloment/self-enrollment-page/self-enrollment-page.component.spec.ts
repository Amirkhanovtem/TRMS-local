import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEnrollmentPageComponent } from './self-enrollment-page.component';

describe('SelfEnrollmentPageComponent', () => {
  let component: SelfEnrollmentPageComponent;
  let fixture: ComponentFixture<SelfEnrollmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfEnrollmentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEnrollmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

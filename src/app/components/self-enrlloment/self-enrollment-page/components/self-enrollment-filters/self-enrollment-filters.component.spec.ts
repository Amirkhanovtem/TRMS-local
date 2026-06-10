import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEnrollmentFiltersComponent } from './self-enrollment-filters.component';

describe('SelfEnrollmentFiltersComponent', () => {
  let component: SelfEnrollmentFiltersComponent;
  let fixture: ComponentFixture<SelfEnrollmentFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfEnrollmentFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelfEnrollmentFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

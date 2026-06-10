import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailabilityResourcesPeriodComponent } from './unavailability-resources-period.component';

describe('UnavailabilityResourcesPeriodComponent', () => {
  let component: UnavailabilityResourcesPeriodComponent;
  let fixture: ComponentFixture<UnavailabilityResourcesPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnavailabilityResourcesPeriodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnavailabilityResourcesPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

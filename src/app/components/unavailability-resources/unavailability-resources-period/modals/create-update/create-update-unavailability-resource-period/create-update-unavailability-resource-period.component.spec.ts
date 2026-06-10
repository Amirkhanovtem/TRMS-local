import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateUnavailabilityResourcePeriodComponent } from './create-update-unavailability-resource-period.component';

describe('CreateUpdateUnavailabilityResourcePeriodComponent', () => {
  let component: CreateUpdateUnavailabilityResourcePeriodComponent;
  let fixture: ComponentFixture<CreateUpdateUnavailabilityResourcePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateUnavailabilityResourcePeriodComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateUnavailabilityResourcePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

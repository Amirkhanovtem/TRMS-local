import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailabilityResourcesLabelComponent } from './unavailability-resources-label.component';

describe('UnavailabilityResourcesTypeComponent', () => {
  let component: UnavailabilityResourcesLabelComponent;
  let fixture: ComponentFixture<UnavailabilityResourcesLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnavailabilityResourcesLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnavailabilityResourcesLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

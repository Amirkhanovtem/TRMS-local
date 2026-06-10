import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalTargetAudienceEmailComponent } from './additional-target-audience-email.component';

describe('AdditionalTargetAudienceEmailComponent', () => {
  let component: AdditionalTargetAudienceEmailComponent;
  let fixture: ComponentFixture<AdditionalTargetAudienceEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalTargetAudienceEmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalTargetAudienceEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

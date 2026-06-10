import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalTargetEmailTableComponent } from './additional-target-email-table.component';

describe('AdditionalEmailComponent', () => {
  let component: AdditionalTargetEmailTableComponent;
  let fixture: ComponentFixture<AdditionalTargetEmailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalTargetEmailTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalTargetEmailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

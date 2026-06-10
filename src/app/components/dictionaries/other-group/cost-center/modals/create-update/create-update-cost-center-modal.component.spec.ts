import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCostCenterModalComponent } from './create-update-cost-center-modal.component';

describe('CreateUpdateCostCenterModalComponent', () => {
  let component: CreateUpdateCostCenterModalComponent;
  let fixture: ComponentFixture<CreateUpdateCostCenterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateCostCenterModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateCostCenterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

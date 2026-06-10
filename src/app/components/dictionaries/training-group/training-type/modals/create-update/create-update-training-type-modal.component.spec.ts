import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingTypeModalComponent } from './create-update-training-type-modal.component';

describe('CreateUpdateTrainingTypeModalComponent', () => {
  let component: CreateUpdateTrainingTypeModalComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTrainingTypeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTrainingTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

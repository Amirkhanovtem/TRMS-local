import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingModalComponent } from './create-update-training-modal.component';

describe('CreateUpdateTrainingModalComponent', () => {
  let component: CreateUpdateTrainingModalComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTrainingModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTrainingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

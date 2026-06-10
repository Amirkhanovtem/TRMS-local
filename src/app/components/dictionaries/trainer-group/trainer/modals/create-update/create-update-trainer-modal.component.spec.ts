import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainerModalComponent } from './create-update-trainer-modal.component';

describe('CreateUpdateTrainerModalComponent', () => {
  let component: CreateUpdateTrainerModalComponent;
  let fixture: ComponentFixture<CreateUpdateTrainerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTrainerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTrainerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

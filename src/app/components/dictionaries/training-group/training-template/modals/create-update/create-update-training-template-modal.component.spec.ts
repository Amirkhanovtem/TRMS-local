import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTrainingTemplateModalComponent } from './create-update-training-template-modal.component';

describe('CreateUpdateTrainingTemplateModalComponent', () => {
  let component: CreateUpdateTrainingTemplateModalComponent;
  let fixture: ComponentFixture<CreateUpdateTrainingTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTrainingTemplateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateTrainingTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

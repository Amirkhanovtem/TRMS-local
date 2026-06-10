import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeCartTrainingTemplateComponent } from './trainee-cart-training-template.component';

describe('TraineeCartTrainingTemplateComponent', () => {
  let component: TraineeCartTrainingTemplateComponent;
  let fixture: ComponentFixture<TraineeCartTrainingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TraineeCartTrainingTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TraineeCartTrainingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

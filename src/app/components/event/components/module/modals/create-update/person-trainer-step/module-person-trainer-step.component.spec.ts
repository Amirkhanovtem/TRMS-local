import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePersonTrainerStepComponent } from './module-person-trainer-step.component';

describe('ModulePersonTrainerStepComponent', () => {
  let component: ModulePersonTrainerStepComponent;
  let fixture: ComponentFixture<ModulePersonTrainerStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModulePersonTrainerStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulePersonTrainerStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

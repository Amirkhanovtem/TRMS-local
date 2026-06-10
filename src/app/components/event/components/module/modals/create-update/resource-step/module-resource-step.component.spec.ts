import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleResourceStepComponent } from './module-resource-step.component';

describe('ModuleResourceStepComponent', () => {
  let component: ModuleResourceStepComponent;
  let fixture: ComponentFixture<ModuleResourceStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleResourceStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleResourceStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

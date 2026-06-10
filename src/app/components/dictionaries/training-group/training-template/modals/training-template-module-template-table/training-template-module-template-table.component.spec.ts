import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTemplateModuleTemplateTableComponent } from './training-template-module-template-table.component';

describe('TrainingTemplateModuleTemplateTableComponent', () => {
  let component: TrainingTemplateModuleTemplateTableComponent;
  let fixture: ComponentFixture<TrainingTemplateModuleTemplateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingTemplateModuleTemplateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingTemplateModuleTemplateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

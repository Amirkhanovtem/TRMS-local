import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingModuleTableComponent } from './training-module-table.component';

describe('TrainingModuleTableComponent', () => {
  let component: TrainingModuleTableComponent;
  let fixture: ComponentFixture<TrainingModuleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrainingModuleTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingModuleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

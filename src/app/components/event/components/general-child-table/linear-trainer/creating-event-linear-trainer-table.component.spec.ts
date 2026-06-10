import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingEventLinearTrainerTableComponent } from './creating-event-linear-trainer-table.component';

describe('TrainingLinearTrainerTableComponent', () => {
  let component: CreatingEventLinearTrainerTableComponent;
  let fixture: ComponentFixture<CreatingEventLinearTrainerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingEventLinearTrainerTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingEventLinearTrainerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

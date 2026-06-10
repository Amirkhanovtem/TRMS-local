import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearOrMainTrainerSelectionModalComponent } from './linear-or-main-trainer-selection-modal.component';

describe('LinearTrainerSelectionModalComponent', () => {
  let component: LinearOrMainTrainerSelectionModalComponent;
  let fixture: ComponentFixture<LinearOrMainTrainerSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinearOrMainTrainerSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinearOrMainTrainerSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

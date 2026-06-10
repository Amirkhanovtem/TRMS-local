import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSelectionModalComponent } from './person-selection-modal.component';

describe('PersonSelectionModalComponent', () => {
  let component: PersonSelectionModalComponent;
  let fixture: ComponentFixture<PersonSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

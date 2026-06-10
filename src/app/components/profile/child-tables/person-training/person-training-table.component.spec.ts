import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTrainingTableComponent } from './person-training-table.component';

describe('PersonTrainingTableComponent', () => {
  let component: PersonTrainingTableComponent;
  let fixture: ComponentFixture<PersonTrainingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonTrainingTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonTrainingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

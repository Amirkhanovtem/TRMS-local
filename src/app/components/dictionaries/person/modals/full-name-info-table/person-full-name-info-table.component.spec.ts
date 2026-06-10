import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFullNameInfoTableComponent } from './person-full-name-info-table.component';

describe('PersonFullNameInfoTableComponent', () => {
  let component: PersonFullNameInfoTableComponent;
  let fixture: ComponentFixture<PersonFullNameInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonFullNameInfoTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonFullNameInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

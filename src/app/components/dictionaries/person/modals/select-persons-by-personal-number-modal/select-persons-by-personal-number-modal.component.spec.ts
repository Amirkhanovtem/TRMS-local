import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPersonsByPersonalNumberModalComponent } from './select-persons-by-personal-number-modal.component';

describe('SelectPersonsByPersonalNumberModalComponent', () => {
  let component: SelectPersonsByPersonalNumberModalComponent;
  let fixture: ComponentFixture<SelectPersonsByPersonalNumberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPersonsByPersonalNumberModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPersonsByPersonalNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

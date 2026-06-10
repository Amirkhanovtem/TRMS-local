import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSyllabusComponent } from './select-syllabus.component';

describe('SelectTargetObjectForSyllabusComponent', () => {
  let component: SelectSyllabusComponent;
  let fixture: ComponentFixture<SelectSyllabusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSyllabusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSyllabusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

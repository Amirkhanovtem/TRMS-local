import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingEventPersonTableComponent } from './creating-event-person-table.component';

describe('SyllabusPersonTableComponent', () => {
  let component: CreatingEventPersonTableComponent;
  let fixture: ComponentFixture<CreatingEventPersonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingEventPersonTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingEventPersonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

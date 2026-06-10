import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingEventMainTrainerTableComponent } from './creating-event-main-trainer-table.component';

describe('CreatingEventMainTrainerTableComponent', () => {
  let component: CreatingEventMainTrainerTableComponent;
  let fixture: ComponentFixture<CreatingEventMainTrainerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingEventMainTrainerTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingEventMainTrainerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

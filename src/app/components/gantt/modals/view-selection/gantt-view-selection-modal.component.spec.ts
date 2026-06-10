import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttViewSelectionModalComponent } from './gantt-view-selection-modal.component';

describe('GanttViewSelectionModalComponent', () => {
  let component: GanttViewSelectionModalComponent;
  let fixture: ComponentFixture<GanttViewSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GanttViewSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GanttViewSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreateErrorsTableModalComponent } from './event-create-errors-table-modal.component';

describe('EventCreateErrorsTableModalComponent', () => {
  let component: EventCreateErrorsTableModalComponent;
  let fixture: ComponentFixture<EventCreateErrorsTableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventCreateErrorsTableModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCreateErrorsTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

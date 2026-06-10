import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingEventRoomTableComponent } from './creating-event-room-table.component';

describe('CreatingEventRoomTableComponent', () => {
  let component: CreatingEventRoomTableComponent;
  let fixture: ComponentFixture<CreatingEventRoomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingEventRoomTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingEventRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

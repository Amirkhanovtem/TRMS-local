import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSelectionModalComponent } from './room-selection-modal.component';

describe('RoomSelectionModalComponent', () => {
  let component: RoomSelectionModalComponent;
  let fixture: ComponentFixture<RoomSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomSelectionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

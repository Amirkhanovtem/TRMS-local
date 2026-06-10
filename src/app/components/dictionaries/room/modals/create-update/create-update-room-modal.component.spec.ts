import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateRoomModalComponent } from './create-update-room-modal.component';

describe('CreateUpdateRoomModalComponent', () => {
  let component: CreateUpdateRoomModalComponent;
  let fixture: ComponentFixture<CreateUpdateRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateRoomModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

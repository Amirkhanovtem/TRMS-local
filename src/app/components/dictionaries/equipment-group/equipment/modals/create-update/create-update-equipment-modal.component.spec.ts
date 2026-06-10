import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateEquipmentModalComponent } from './create-update-equipment-modal.component';

describe('CreateModalComponent', () => {
  let component: CreateUpdateEquipmentModalComponent;
  let fixture: ComponentFixture<CreateUpdateEquipmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateEquipmentModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateEquipmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

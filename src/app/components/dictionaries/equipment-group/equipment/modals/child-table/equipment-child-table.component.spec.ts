import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentChildTableComponent } from './equipment-child-table.component';

describe('EquipmentChildTableComponent', () => {
  let component: EquipmentChildTableComponent;
  let fixture: ComponentFixture<EquipmentChildTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentChildTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentChildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

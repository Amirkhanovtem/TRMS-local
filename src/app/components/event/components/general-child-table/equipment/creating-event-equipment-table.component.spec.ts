import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingEventEquipmentTableComponent } from './creating-event-equipment-table.component';

describe('SyllabusEquipmentTableComponent', () => {
  let component: CreatingEventEquipmentTableComponent;
  let fixture: ComponentFixture<CreatingEventEquipmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingEventEquipmentTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatingEventEquipmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

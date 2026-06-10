import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateEquipmentCategoryModalComponent } from './create-update-equipment-category-modal.component';

describe('CreateModalComponent', () => {
  let component: CreateUpdateEquipmentCategoryModalComponent;
  let fixture: ComponentFixture<CreateUpdateEquipmentCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateEquipmentCategoryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateEquipmentCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

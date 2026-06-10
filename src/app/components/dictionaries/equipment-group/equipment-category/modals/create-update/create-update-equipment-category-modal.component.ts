import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { EquipmentCategoryModel } from '@equipment-category-models/equipment-category.model';
import { EquipmentCategoryService } from '@equipment-category-services/equipment-category.service';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { EquipmentType } from '@equipment-models/equipment-type';
import { LocationModel } from '@location-models/location.model';
import { LocationService } from '@location-services/location.service';

@Component({
  selector: 'app-create-equipment-category-modal',
  templateUrl: './create-update-equipment-category-modal.component.html',
  styleUrls: ['./create-update-equipment-category-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateEquipmentCategoryModalComponent
  extends CommonCreateUpdateComponents<EquipmentModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public equipmentCategory: EquipmentCategoryModel = new EquipmentCategoryModel();
  public locations: Array<LocationModel> = [];
  public allEquipmentTypes: Array<StandardEnumModel>;

  readonly EQUIPMENT_TYPE: typeof EquipmentType = EquipmentType;

  constructor(
    private equipmentCategoryService: EquipmentCategoryService,
    private locationService: LocationService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadEquipmentCategoryDetail();
    this.loadLocations();
  }

  loadEquipmentCategoryDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.equipmentCategoryService.getEquipmentCategory(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.equipmentCategory = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadLocations(): void {
    this.locationService.list().subscribe({
      next: data => {
        this.locations = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      location: [{ value: '', disabled: this.dialogParams?.isView }],
      availableCount: ['', []],
      totalCount: ['', []],
    });
  }

  createOrSaveEquipmentCategory(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.equipmentCategoryService
      .create(this.equipmentCategory)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.equipmentCategoryService
      .update(this.equipmentCategory)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  getLocationName(location: LocationModel): string {
    return location.name + ' (' + location.address + ')';
  }
}

import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateEquipmentCategoryModalComponent } from '@equipment-category-modals-create-update/create-update-equipment-category-modal.component';
import { EquipmentCategoryModel } from '@equipment-category-models/equipment-category.model';
import { EquipmentCategoryService } from '@equipment-category-services/equipment-category.service';
import { LocationModel } from '@location-models/location.model';

@Component({
  selector: 'app-equipment-category',
  templateUrl: './equipment-category.component.html',
  styleUrls: ['./equipment-category.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class EquipmentCategoryComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateEquipmentCategoryModalComponent> =
    CreateUpdateEquipmentCategoryModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'equipmentCategoryNameColTable',
    },
    {
      colDef: 'location',
      colTitleLocKey: 'equipmentCategoryLocationColTable',
      colGetValueFunc: this.getLocationName,
    },
    {
      colDef: 'totalCount',
      colTitleLocKey: 'equipmentCategoryTotalCountColTable',
    },
    {
      colDef: 'availableCount',
      colTitleLocKey: 'equipmentCategoryAvailableCountColTable',
    },
  ];

  constructor(
    public equipmentCategoryService: EquipmentCategoryService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadEquipmentCategories();
  }

  public loadEquipmentCategories() {
    this.table.loading = true;

    this.equipmentCategoryService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  getLocationName(equipmentCategory: EquipmentCategoryModel): string {
    const location: LocationModel = equipmentCategory.location;

    return location.name + ' (' + location.address + ')';
  }
}

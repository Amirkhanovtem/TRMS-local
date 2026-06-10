import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateEquipmentModalComponent } from '@equipment-modals-create-update/create-update-equipment-modal.component';
import { EquipmentService } from '@equipment-services/equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class EquipmentComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateEquipmentModalComponent> =
    CreateUpdateEquipmentModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'equipmentNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'equipmentCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'equipmentDescriptionColTable',
    },
    {
      colDef: 'type',
      colTitleLocKey: 'equipmentTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'quantity',
      colTitleLocKey: 'equipmentQuantityColTable',
    },
    {
      colDef: 'status',
      colTitleLocKey: 'equipmentStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'equipmentCategory',
      colTitleLocKey: 'equipmentCategoryColTable',
      modelPropertyPath: ['equipmentCategory', 'name'],
    },
    {
      colDef: 'room',
      colTitleLocKey: 'equipmentRoomColTable',
      modelPropertyPath: ['room', 'name'],
    },
  ];

  constructor(
    public equipmentService: EquipmentService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadEquipments();
  }

  public loadEquipments(): void {
    this.table.loading = true;

    this.equipmentService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}

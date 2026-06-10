import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateEquipmentModalComponent } from '@equipment-modals-create-update/create-update-equipment-modal.component';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-equipment-child-table',
  templateUrl: './equipment-child-table.component.html',
  styleUrls: ['./equipment-child-table.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class EquipmentChildTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'equipmentNameColTable',
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
  ];

  constructor(
    public personService: PersonService,
    private injector: Injector,
  ) {
    super(injector);
  }

  updateEquipmentDataSource(data): void {
    this.table.commonLoadTableHandler(data);
  }

  equipmentOpenViewModal(equipment: EquipmentModel): void {
    this.newModal.open(CreateUpdateEquipmentModalComponent, {
      data: {
        model: equipment,
        isView: true,
      },
    });
  }
}

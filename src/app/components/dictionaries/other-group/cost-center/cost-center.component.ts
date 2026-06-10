import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateCostCenterModalComponent } from '@cost-center-modals-create-update/create-update-cost-center-modal.component';
import { CostCenterService } from '@cost-center-services/cost-center.service';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class CostCenterComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateCostCenterModalComponent> =
    CreateUpdateCostCenterModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'costCenterNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'costCenterCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'costCenterDescriptionColTable',
    },
    {
      colDef: 'isActive',
      colTitleLocKey: 'costCenterIsActiveColTable',
      colType: DisplayedColumnTypeEnum.BOOLEAN,
    },
  ];

  constructor(
    public costCenterService: CostCenterService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCostCenters();
  }

  public loadCostCenters() {
    this.table.loading = true;

    this.costCenterService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}

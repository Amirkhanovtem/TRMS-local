import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdatePositionModalComponent } from '@position-modals-create-update/create-update-position-modal.component';
import { PositionService } from '@position-services/position.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class PositionComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdatePositionModalComponent> = CreateUpdatePositionModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'nameRu',
      colTitleLocKey: 'positionNameRuColTable',
    },
    {
      colDef: 'nameKz',
      colTitleLocKey: 'positionNameKzColTable',
    },
    {
      colDef: 'nameEn',
      colTitleLocKey: 'positionNameEnColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'positionCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'positionDescriptionColTable',
    },
  ];

  constructor(
    public positionService: PositionService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadPositions();
  }

  public loadPositions() {
    this.table.loading = true;

    this.positionService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
